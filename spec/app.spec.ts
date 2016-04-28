import * as request from 'supertest';
import App from '../src/app';
import FacebookActor from '../src/actors/facebook';

describe('App', () => {
  const VERIFY_TOKEN = '1234';
  var server: any;
  var fbActor: FacebookActor;

  beforeEach(function () {
    fbActor = new FacebookActor({
      FB_VERIFY_TOKEN: VERIFY_TOKEN
    });
    server = new App(fbActor).server;
  });

  afterEach(function () {
    server.close();
  });

  it('should return hello world', (done) => {
    request(server)
      .get('/')
      .expect('Hello Techion Bot!')
      .end((err, res) => (err) ? done.fail(err) : done());
  });

  it('should return ack for facebook webook', (done) => {
    request(server)
      .get(`/fb?hub.mode=subscribe&hub.verify_token=${VERIFY_TOKEN}&hub.challenge=super`)
      .expect('super')
      .end((err, res) => (err) ? done.fail(err) : done());
  });

  it('should return bad request if invalid parameter for facebook webook', (done) => {
    request(server)
      .get('/fb?hub.mode=subscribe&hub.verify_token=undefined&hub.challenge=super')
      .expect(400)
      .end((err, res) => (err) ? done.fail(err) : done());
  });
});
