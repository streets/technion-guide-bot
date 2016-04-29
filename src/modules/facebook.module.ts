import * as express from 'express';
import Bot from './bot.module';
import Server from './server.module';
import { FacebookConfig } from '../config/facebook.config';

export default class Facebook {
  constructor(private config: FacebookConfig, private server: Server, private bot: Bot) {
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

  receive(data: FbMessengerPlatform.InTextMessage): void {
    let messages = this.extractMessages(data);
    messages.forEach((msg) => {
      this.bot.run(msg.fbid, msg.text, {}, () => { });
    });
  }

  send() {
    console.log('I am sending a message thru to facebook user');
  }
}
