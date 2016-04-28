// import* as request from 'request';
import * as express from 'express';
import FacebookActor from './actors/facebook';

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 1337;

const fbActor = new FacebookActor();

const app = express();

app.set('port', PORT);
app.use(bodyParser.json());

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello Techion Bot!');
});

app.get('/fb', fbActor.ack);

const server = app.listen(app.get('port'));

export default server;
