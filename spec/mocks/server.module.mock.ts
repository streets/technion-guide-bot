const bodyParser = require('body-parser');

import * as express from 'express';
import * as http from 'http';
import Server from '../../src/modules/server.module';

export default class MockServer extends Server {
  public app: express.Application;
  public server: http.Server;
  constructor() {
    super({});
    this.app = express();
    this.app.use(bodyParser.json());
    this.server = this.app.listen(8765);
  }
}
