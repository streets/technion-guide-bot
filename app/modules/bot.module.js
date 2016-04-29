"use strict";
const container = require('kontainer-di');
class Bot {
    constructor() {
        console.log('I am Bot!');
    }
    run(sessionId, message, context, cb) {
        var fb = container.get('facebook');
        console.log('I am running action');
        fb.send();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Bot;
//# sourceMappingURL=bot.module.js.map