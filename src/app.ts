import * as express from 'express';
import FacebookActor from './actors/facebook';

const bodyParser = require('body-parser');
const PORT = process.env.PORT || 1337;

export default class App {
  server: any;
  constructor(facebookActor: FacebookActor) {
    const app = express();

    app.set('port', PORT);
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
      res.send('Hello Techion Bot!');
    });

    app.get('/fb', (req, res) => {
      facebookActor.ack(req, res);
    });

    this.server = app.listen(app.get('port'));
  }
}
