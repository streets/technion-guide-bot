import * as request from 'superagent';
import * as express from 'express';
import Bot from './bot.module';
import Server from './server.module';
import { FacebookConfig } from '../config/facebook.config';

export default class Facebook {
  constructor(
    private sessions: Map<string, Object>,
    private config: FacebookConfig,
    private server: Server,
    private bot: Bot
  ) {
    let app = server.app;

    app.get('/fb', (req: express.Request, res: express.Response) => {
      this.verify(req, res);
    });

    app.post('/fb', (req: express.Request, res: express.Response) => {
      this.receive(req.body);
      res.sendStatus(200);
    });
  }

  private isValid(query: { 'hub.mode': string; 'hub.verify_token': string }) {
    return query['hub.mode'] === 'subscribe' &&
      query['hub.verify_token'] === this.config.FB_VERIFY_TOKEN;
  }

  private verify(req: express.Request, res: express.Response) {
    if (this.isValid(req.query)) {
      console.log('TECHION-BOT: request from facebook is verified');
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
  }

  private extractMessages(data: FbMessengerPlatform.InTextMessage): Array<{ fbid: string, text: string }> {
    console.log(JSON.stringify(data));
    let flattenMessages = data.entry.reduce((acc, curr) => {
      return acc.concat(curr.messaging);
    }, []);
    console.log(JSON.stringify(flattenMessages));
    let onlyRelevantMessages = flattenMessages.filter((msg) => {
      return msg.recipient.id === this.config.FB_PAGE_ID;
    });
    console.log(JSON.stringify(onlyRelevantMessages));
    let messages = onlyRelevantMessages.map((msg) => {
      return {
        fbid: msg.sender.id,
        text: msg.message.text
      };
    });
    console.log(JSON.stringify(messages));
    return messages;
  }

  private retrieveContext(msg: { fbid: string, text: string }): { fbid: string, text: string, context: any } {
    let context: any = {};
    if (this.sessions.has(msg.fbid)) {
      context = this.sessions.get(msg.fbid);
    } else {
      this.sessions.set(msg.fbid, context);
    }
    return Object.assign({}, msg, { context });
  }

  receive(data: FbMessengerPlatform.InTextMessage): void {
    console.log('TECHION-BOT: a message from facebook received', JSON.stringify(data));
    let messages = this.extractMessages(data);

    let messagesWithContext = messages.map(this.retrieveContext, this);

    messagesWithContext.forEach((msg) => {
      console.log('TECHION-BOT: processing message from', msg.fbid);
      console.log('TECHION-BOT: processing message', msg.text);
      this.bot.run(msg.fbid, msg.text, msg.context, (err: any, context: any) => {
        if (err) {
          console.log('Oops! Got an error from Wit:', err);
        } else {
          this.sessions.set(msg.fbid, context);
        }
      });
    });
  }

  private sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      request
        .post('https://graph.facebook.com/me/messages')
        .send(message)
        .type('json')
        .query({
          access_token: this.config.FB_PAGE_TOKEN
        })
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  }

  sendText(recepientId: string, text: string): Promise<any> {
    console.log('TECHION-BOT: sending message to', recepientId);
    console.log('TECHION-BOT: message ', text);
    let message: FbMessengerPlatform.OutTextMessage = {
      recipient: {
        id: recepientId
      },
      message: {
        text: text
      }
    };
    return this.sendMessage(message);
  }

  sendNavigation(recepientId: string, navUrl: string): Promise<any> {
    console.log('TECHION-BOT: sending url to', recepientId);
    console.log('TECHION-BOT: url ', navUrl);
    let message: FbMessengerPlatform.OutGenericMessage = {
      recipient: {
        id: recepientId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: `No problem, I'll get you there`,
              image_url: 'http://designshack.net/images/designs/neat-map-icon.jpg',
              subtitle: 'Click the button below to open the path in google maps',
              buttons: [{
                type: 'web_url',
                url: navUrl,
                title: 'Follow me!'
              }]
            }]
          }
        }
      }
    };
    return this.sendMessage(message);
  }
}
