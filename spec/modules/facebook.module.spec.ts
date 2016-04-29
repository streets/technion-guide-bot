import * as request from 'supertest';
import FacebookModule from '../../src/modules/facebook.module';
import MockServer from '../mocks/server.module.mock';
import { createIncomingMessages } from '../fixtures/messages.fixtures';

describe('Facebook module', () => {

  const VERIFY_TOKEN = 'verify-me';
  var fb: FacebookModule;
  var mockServer: MockServer;
  var mockBot = {
    run: jasmine.createSpy('bot-run')
  };

  beforeEach(() => {
    mockServer = new MockServer();
    fb = new FacebookModule(
      { FB_VERIFY_TOKEN: VERIFY_TOKEN, FB_PAGE_ID: 'pageId' },
      mockServer,
      mockBot
    );
  });

  afterEach(() => {
    mockServer.server.close();
  });


  it('should return ack for facebook webook', (done) => {
    request(mockServer.server)
      .get(`/fb?hub.mode=subscribe&hub.verify_token=${VERIFY_TOKEN}&hub.challenge=super`)
      .expect('super')
      .end((err, res) => (err) ? done.fail(err) : done());
  });

  it('should return bad request if invalid parameter for facebook webook', (done) => {
    request(mockServer.server)
      .get('/fb?hub.mode=subscribe&hub.verify_token=undefined&hub.challenge=super')
      .expect(400)
      .end((err, res) => (err) ? done.fail(err) : done());
  });

  it('should get a message and send it to bot', (done) => {
    let inMessage = createIncomingMessages([
      {
        fbid: 'userId_1',
        text: 'Hello World'
      },
      {
        fbid: 'userId_2',
        text: 'Hello World 2'
      }
    ]);
    request(mockServer.server)
      .post('/fb')
      .send(inMessage)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done.fail(err);
        } else {
          expect(mockBot.run.calls.argsFor(0)).toEqual(['userId_1', 'Hello World', jasmine.any(Object), jasmine.any(Function)]);
          expect(mockBot.run.calls.argsFor(1)).toEqual(['userId_2', 'Hello World 2', jasmine.any(Object), jasmine.any(Function)]);
          done();
        }
      });
  });
});
