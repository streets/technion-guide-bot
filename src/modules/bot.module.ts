const container = require('kontainer-di');
import { Wit } from 'node-wit';
import Facebook from './facebook.module';

export default class Bot {

  wit: Wit;

  constructor(
    private config: any
  ) {
    this.wit = new Wit(this.config.WIT_TOKEN, {
      say: this.say.bind(this),
      merge: this.merge.bind(this),
      error: this.error.bind(this)
    });
  }

  say(sessionId: string, context: any, message: string, callback: Function) {
    const fb: Facebook =  container.get('facebook');
    fb.sendText(sessionId, message)
      .then(() => {
        callback();
      })
      .catch((error) => {
        console.error(error.message);
        callback();
      });
  }

  merge(sessionId: string, context: any, entities: Array<{}>, message: string, callback: Function) { }

  error(sessionId: string, context: any, err: any) {
    console.error('Error from wit', err.message);
  }

  run(sessionId: string, message: string, context: Object, cb: (err: any, context: any) => void) {
    this.wit.runActions(sessionId, message, context, cb);
  }
}
