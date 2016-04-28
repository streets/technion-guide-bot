// import request from 'request';
import * as express from 'express';

type FacebookActorParams = {
  FB_VERIFY_TOKEN: string
};

export default class FacebookActor {
  FB_VERIFY_TOKEN: string;

  constructor(params: FacebookActorParams) {
    this.FB_VERIFY_TOKEN = params.FB_VERIFY_TOKEN;
  }

  ack(req: express.Request, res: express.Response) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === this.FB_VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
  }
}
