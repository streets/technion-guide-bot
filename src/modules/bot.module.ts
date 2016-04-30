const container = require('kontainer-di');
import { Wit } from 'node-wit';

export default class Bot {

  wit: Wit;

  constructor(
    private sessions: Map<string, Object>,
    private config: any
  ) {
    this.wit = new Wit(this.config.WIT_TOKEN, {
      say: this.say.bind(this),
      merge: this.merge.bind(this),
      error: this.error.bind(this)
    });
  }

  say(sessionId: string, context: any, message: string, callback: Function) { }

  merge(sessionId: string, context: any, entities: Array<{}>, message: string, callback: Function) { }

  error(sessionId: string, context: any, err: any) {
    console.error('Error from wit', err.message);
  }

  run(sessionId: string, message: string, context: Object, cb: (err: any, context: any) => void) {
    this.wit.runActions(sessionId, message, context, cb);
  }
}
