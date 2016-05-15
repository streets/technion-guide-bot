"use strict";
const container = require('kontainer-di');
const diceScore = require('dice-coefficient');
const node_wit_1 = require('node-wit');
class Bot {
    constructor(config, db) {
        this.config = config;
        this.db = db;
        this.wit = new node_wit_1.Wit(this.config.WIT_TOKEN, {
            say: this.say.bind(this),
            merge: this.merge.bind(this),
            error: this.error.bind(this),
            search: this.search.bind(this)
        });
    }
    maybeGetFirstValue(entities, entity) {
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
    getBuildings(query) {
        return this.db.getBuildings().then((res) => {
            return res.body;
        });
    }
    getRelevantBuilding(buildings, query) {
        let maxScore = 0;
        let bldgKey;
        Object.keys(buildings).forEach((key) => {
            let score = diceScore(query, key);
            if (score > maxScore) {
                maxScore = score;
                bldgKey = key;
            }
        });
        return buildings[bldgKey];
    }
    getMostRelevantBuilding(query) {
        return this.getBuildings(query)
            .then((buildings) => {
            return this.getRelevantBuilding(buildings, query);
        });
    }
    say(sessionId, context, message, callback) {
        const fb = container.get('facebook');
        fb.sendText(Number(sessionId), message)
            .then(() => {
            callback();
        })
            .catch((error) => {
            console.error(error.message);
            callback();
        });
    }
    merge(sessionId, context, entities, message, callback) {
        context.query = this.maybeGetFirstValue(entities, 'guide_building');
        context.room = this.maybeGetFirstValue(entities, 'number');
        callback(context);
    }
    error(sessionId, context, err) {
        console.error('Error from wit', err.message);
    }
    search(sessionId, context, callback) {
        const fb = container.get('facebook');
        this.getMostRelevantBuilding(context.query)
            .then((bldg) => {
            if (bldg) {
                console.log(`TECHNION-BOT at ${new Date().toISOString()}: building ${bldg.name} found for '${context.query}' query`);
                let coordinates = bldg.coordinates;
                context.url = `http: //www.google.com/maps?saddr=My+Location&daddr=${coordinates[0]},${coordinates[1]}`;
                return fb.sendText(Number(sessionId), context.url);
            }
            else {
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
    run(sessionId, message, context, cb) {
        console.log(`TECHNION-BOT at ${new Date().toISOString()}: message '${message}' received from ${sessionId}`);
        this.wit.runActions(sessionId, message, context, cb);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Bot;
//# sourceMappingURL=bot.module.js.map