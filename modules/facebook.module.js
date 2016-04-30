"use strict";
const request = require('superagent');
class Facebook {
    constructor(sessions, config, server, bot) {
        this.sessions = sessions;
        this.config = config;
        this.server = server;
        this.bot = bot;
        let app = server.app;
        app.get('/fb', (req, res) => {
            this.verify(req, res);
        });
        app.post('/fb', (req, res) => {
            this.receive(req.body);
            res.sendStatus(200);
        });
    }
    isValid(query) {
        return query['hub.mode'] === 'subscribe' &&
            query['hub.verify_token'] === this.config.FB_VERIFY_TOKEN;
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
            return msg.recipient.id === Number(this.config.FB_PAGE_ID);
        });
        let messages = onlyRelevantMessages.map((msg) => {
            return {
                fbid: msg.sender.id,
                text: msg.message.text
            };
        });
        return messages;
    }
    retrieveContext(msg) {
        let context = {};
        if (this.sessions.has(msg.fbid)) {
            context = this.sessions.get(msg.fbid);
        }
        else {
            this.sessions.set(msg.fbid, context);
        }
        return Object.assign({}, msg, { context: context });
    }
    receive(data) {
        let messages = this.extractMessages(data);
        let messagesWithContext = messages.map(this.retrieveContext, this);
        console.log(`TECHION-BOT at ${new Date().toISOString()}: processing messages`, JSON.stringify(messagesWithContext));
        messagesWithContext.forEach((msg) => {
            this.bot.run(msg.fbid, msg.text, msg.context, (err, context) => {
                if (err) {
                    console.log('Oops! Got an error from Wit:', err);
                }
                else {
                    this.sessions.set(msg.fbid, context);
                }
            });
        });
    }
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            request
                .post('https://graph.facebook.com/me/messages')
                .send(message)
                .type('json')
                .query({
                access_token: this.config.FB_PAGE_TOKEN
            })
                .end((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
    sendText(recepientId, text) {
        console.log(`TECHION-BOT at ${new Date().toISOString()}: sending '${text}' to ${recepientId}`);
        let message = {
            recipient: {
                id: recepientId
            },
            message: {
                text: text
            }
        };
        return this.sendMessage(message);
    }
    sendNavigation(recepientId, navUrl) {
        console.log(`TECHION-BOT at ${new Date().toISOString()}: sending '${navUrl}' to ${recepientId}`);
        let message = {
            recipient: {
                id: recepientId
            },
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [{
                                title: `No problem, I'll get you there`,
                                image_url: 'http://designshack.net/images/designs/neat-map-icon.jpg',
                                subtitle: 'Click the button below to open the path in google maps',
                                buttons: [{
                                        type: 'web_url',
                                        url: navUrl,
                                        title: 'Follow me!'
                                    }]
                            }]
                    }
                }
            }
        };
        return this.sendMessage(message);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Facebook;
//# sourceMappingURL=facebook.module.js.map