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
    return query['hub.mode'] === 'subscribe' && query['hub.verify_token'] === this.config.FB_VERIFY_TOKEN;
  }

  private verify(req: express.Request, res: express.Response) {
    if (this.isValid(req.query)) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
  }

  private extractMessages(data: FbMessengerPlatform.InTextMessage): Array<{ fbid: string, text: string }> {
    let flattenMessages = data.entry.reduce((acc, curr) => {
      return acc.concat(curr.messaging);
    }, []);
    let onlyRelevantMessages = flattenMessages.filter((msg) => {
      return msg.recipient.id === this.config.FB_PAGE_ID;
    });
    return onlyRelevantMessages.map((msg) => {
      return {
        fbid: msg.sender.id,
        text: msg.message.text
      };
    });
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
    let messages = this.extractMessages(data);
    let messagesWithContext = messages.map(this.retrieveContext, this);
    messagesWithContext.forEach((msg) => {
      this.bot.run(msg.fbid, msg.text, msg.context, (err: any, context: any) => {
        if (err) {
          console.log('Oops! Got an error from Wit:', err);
        } else {
          this.sessions.set(msg.fbid, context);
        }
      });
    });
  }

  send() {
    console.log('I am sending a message thru to facebook user');
  }
}
