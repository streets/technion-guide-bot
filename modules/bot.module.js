"use strict";
const container = require('kontainer-di');
const node_wit_1 = require('node-wit');
class Bot {
    constructor(config) {
        this.config = config;
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
    error(sessionId, context, err) {
        console.error('Error from wit', err.message);
    }
    search(sessionId, context, callback) {
        const fb = container.get('facebook');
        context.url = `http: //www.google.com/maps?saddr=My+Location&daddr=32.7745127,35.0231037`;
        fb.sendText(Number(sessionId), context.url)
            .then(() => {
            callback(context);
        })
            .catch(() => {
            callback(context);
        });
    }
    run(sessionId, message, context, cb) {
        console.log(`TECHION-BOT at ${new Date().toISOString()}: message '${message}' received from ${sessionId}`);
        this.wit.runActions(sessionId, message, context, cb);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Bot;
//# sourceMappingURL=bot.module.js.map