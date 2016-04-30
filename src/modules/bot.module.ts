const container = require('kontainer-di');
import { Wit } from 'node-wit';
import Facebook from './facebook.module';

export default class Bot {

  wit: Wit;

  constructor(
    private config: any
  ) {
    this.wit = new Wit(this.config.WIT_TOKEN, <any>{
      say: this.say.bind(this),
      merge: this.merge.bind(this),
      error: this.error.bind(this),
      search: this.search.bind(this)
    });
  }

  private maybeGetFirstValue(entities: any, entity: string) {
    const val = entities &&
      entities[entity] &&
      Array.isArray(entities[entity]) &&
      entities[entity].length > 0 &&
      entities[entity][0].value;
    if (!val) {
      return null;
    }
    return typeof val === 'object' ? val.value : val;
  }

  say(sessionId: any, context: any, message: string, callback: Function) {
    const fb: Facebook = container.get('facebook');
    fb.sendText(Number(sessionId), message)
      .then(() => {
        callback();
      })
      .catch((error) => {
        console.error(error.message);
        callback();
      });
  }

  merge(sessionId: any, context: any, entities: any, message: string, callback: Function) {
    let query = this.maybeGetFirstValue(entities, 'guide_building');
    let room = this.maybeGetFirstValue(entities, 'number');
    if (query) {
      context.query = query;
    }
    if (room) {
      context.room = room;
    }
    callback(context);
  }

  error(sessionId: any, context: any, err: any) {
    console.error('Error from wit', err.message);
  }

  search(sessionId: any, context: any, callback: Function) {
    const fb: Facebook = container.get('facebook');
    context.url = `http: //www.google.com/maps?saddr=My+Location&daddr=32.7745127,35.0231037`;
    fb.sendNavigation(Number(sessionId), context.url)
      .then(() => {
        callback(context);
      })
      .catch(() => {
        callback(context);
      });

  }

  run(sessionId: any, message: string, context: Object, cb: (err: any, context: any) => void) {
    this.wit.runActions(sessionId, message, context, cb);
  }
}
