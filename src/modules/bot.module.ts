const container = require('kontainer-di');
const diceScore = require('dice-coefficient');

import { Wit } from 'node-wit';
import Facebook from './facebook.module';
import Firebase from './firebase.module';

type Building = {
  name: string;
  department: string;
  coordinates: Array<number>
}

export default class Bot {

  wit: Wit;

  constructor(
    private config: any,
    private db: Firebase
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

  private getBuildings(query: string): Promise<{ [key: string]: Building }> {
    return this.db.getBuildings().then((res) => {
      return res.body;
    });
  }

  private getRelevantBuilding(buildings: { [key: string]: Building }, query: string): Building {
    let maxScore: number = 0;
    let bldgKey: string;
    Object.keys(buildings).forEach((key) => {
      let score = diceScore(query, key);
      if (score > maxScore) {
        maxScore = score;
        bldgKey = key;
      }
    });
    return buildings[bldgKey];
  }

  private getMostRelevantBuilding(query: string): Promise<Building> {
    return this.getBuildings(query)
      .then((buildings) => {
        return this.getRelevantBuilding(buildings, query);
      });
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
    context.query = this.maybeGetFirstValue(entities, 'guide_building');
    context.room = this.maybeGetFirstValue(entities, 'number');
    callback(context);
  }

  error(sessionId: any, context: any, err: any) {
    console.error('Error from wit', err.message);
  }

  search(sessionId: any, context: any, callback: Function) {
    const fb: Facebook = container.get('facebook');
    this.getMostRelevantBuilding(context.query)
      .then((bldg) => {
        if (bldg) {
          console.log(`TECHNION-BOT at ${new Date().toISOString()}: building ${bldg.name} found for '${context.query}' query`);
          let coordinates = bldg.coordinates;
          context.url = `http: //www.google.com/maps?saddr=My+Location&daddr=${coordinates[0]},${coordinates[1]}`;
          return fb.sendText(Number(sessionId), context.url);
        } else {
          console.warn(`TECHNION-BOT at ${new Date().toISOString()}: building is NOT found for '${context.query}' query`);
          return fb.sendText(Number(sessionId), 'Sorry, no such building was found, try again');
        }
      })
      .then(() => {
        callback(context);
      })
      .catch(() => {
        callback(context);
      });
  }

  run(sessionId: any, message: string, context: Object, cb: (err: any, context: any) => void) {
    console.log(`TECHNION-BOT at ${new Date().toISOString()}: message '${message}' received from ${sessionId}`);
    this.wit.runActions(sessionId, message, context, cb);
  }
}
