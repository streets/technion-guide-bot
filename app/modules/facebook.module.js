"use strict";
class Facebook {
    constructor(config, server, bot) {
        this.config = config;
        this.server = server;
        this.bot = bot;
        let app = server.app;
        app.get('/fb', (req, res) => {
            this.verify(req, res);
        });
        app.post('/fb', (req, res) => {
            this.receive();
        });
    }
    isValid(query) {
        return query['hub.mode'] === 'subscribe' && query['hub.verify_token'] === this.config.FB_VERIFY_TOKEN;
    }
    verify(req, res) {
        if (this.isValid(req.query)) {
            res.send(req.query['hub.challenge']);
        }
        else {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Facebook;
//# sourceMappingURL=facebook.module.js.map