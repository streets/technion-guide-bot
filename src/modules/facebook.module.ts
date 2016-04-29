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
      this.receive();
    });
  }

  private isValid(query: {'hub.mode': string; 'hub.verify_token': string}) {
    return query['hub.mode'] === 'subscribe' && query['hub.verify_token'] === this.config.FB_VERIFY_TOKEN;
  }

  private verify(req: express.Request, res: express.Response) {
    if (this.isValid(req.query)) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
  }

  receive() {
    this.bot.run();
  }

  send() {
    console.log('I am sending a message thru to facebook user');
  }
}
