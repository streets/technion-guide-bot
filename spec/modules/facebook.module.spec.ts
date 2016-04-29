import * as request from 'supertest';
import sessions from '../../src/modules/sessions.module';
import FacebookModule from '../../src/modules/facebook.module';
import MockServer from '../mocks/server.module.mock';
import { createIncomingMessages } from '../fixtures/messages.fixtures';

describe('Facebook module', () => {

  const VERIFY_TOKEN = 'verify-me';
  var fb: FacebookModule;
  var mockServer: MockServer;
  var mockBot: any;

  sessions.set('userId_1', { test: 'test' });

  beforeEach(() => {
    mockServer = new MockServer();
    mockBot = {
      run: jasmine.createSpy('bot-run')
    };
    fb = new FacebookModule(
      sessions,
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

  it('should get a messages and send them to the bot', (done) => {
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
          expect(mockBot.run.calls.argsFor(0)).toEqual(['userId_1', 'Hello World', { test: 'test' }, jasmine.any(Function)]);
          expect(mockBot.run.calls.argsFor(1)).toEqual(['userId_2', 'Hello World 2', {}, jasmine.any(Function)]);
          done();
        }
      });
  });

  it('should update the context with a new one', (done) => {
    let inMessage = createIncomingMessages([
      {
        fbid: 'userId_1',
        text: 'Hello World'
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
          let cb = mockBot.run.calls.argsFor(0)[3];
          let newContext = { test: '1234' };
          cb(null, newContext);
          expect(sessions.get('userId_1')).toEqual(newContext);
          done();
        }
      });
  });

});
