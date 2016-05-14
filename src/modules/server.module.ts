const bodyParser = require('body-parser');

import * as http from 'http';
import * as express from 'express';

export default class Server {
  public app: express.Application;
  public server: http.Server;

  constructor(private config: any) {
    this.app = express();

    this.app.set('port', config.PORT);
    this.app.use(bodyParser.json());

    this.app.get('/', (req: any, res: any) => {
      res.send('Hello Technion Bot!');
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
