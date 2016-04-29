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
            console.log(req.body);
            this.receive(req.body);
            res.sendStatus(200);
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
    extractMessages(data) {
        let flattenMessages = data.entry.reduce((acc, curr) => {
            return acc.concat(curr.messaging);
        }, []);
        let onlyRelevantMessages = flattenMessages.filter((msg) => {
            return msg.recipient.id === this.config.FB_PAGE_ID;
        });
        return onlyRelevantMessages.map((msg) => {
            return {
                fbid: msg.sender.id,
                text: msg.message.text
            };
        });
    }
    receive(data) {
        let messages = this.extractMessages(data);
        messages.forEach((msg) => {
            this.bot.run(msg.fbid, msg.text, {}, () => { });
        });
    }
    send() {
        console.log('I am sending a message thru to facebook user');
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Facebook;
//# sourceMappingURL=facebook.module.js.map