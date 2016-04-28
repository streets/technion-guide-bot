// import request from 'request';
import * as express from 'express';

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

export default class FacebookActor {
  constructor() { }

  ack(req: express.Request, res: express.Response) {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
      res.send(req.query['hub.challenge']);
    } else {
      res.sendStatus(400);
    }
  }
}
