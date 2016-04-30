"use strict";
const bodyParser = require('body-parser');
const express = require('express');
class Server {
    constructor(config) {
        this.config = config;
        this.app = express();
        this.app.set('port', config.PORT);
        this.app.use(bodyParser.json());
        this.app.get('/', (req, res) => {
            res.send('Hello Techion Bot!');
        });
    }
    start() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.config.PORT, () => {
                let host = this.server.address().address;
                let port = this.server.address().port;
                console.log(`Express is listening on ${host}:${port}`);
                resolve();
            });
        });
    }
    stop() {
        this.server.close();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Server;
//# sourceMappingURL=server.module.js.map