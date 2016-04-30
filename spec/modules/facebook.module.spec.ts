import * as request from 'supertest';
import * as nock from 'nock';
import sessions from '../../src/modules/sessions.module';
import FacebookModule from '../../src/modules/facebook.module';
import MockServer from '../mocks/server.module.mock';
import { createIncomingMessages } from '../fixtures/messages.fixtures';

describe('Facebook module', () => {

  const VERIFY_TOKEN = 'verify-me';
  const PAGE_TOKEN = 'IamToken';
  var fb: FacebookModule;
  var mockServer: MockServer;
  var mockBot: any;

  sessions.set(1, { test: 'test' });

  beforeEach(() => {
    mockServer = new MockServer();
    mockBot = {
      run: jasmine.createSpy('bot-run')
    };
    fb = new FacebookModule(
      sessions,
      { FB_VERIFY_TOKEN: VERIFY_TOKEN, FB_PAGE_ID: 999, FB_PAGE_TOKEN: PAGE_TOKEN },
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
        fbid: 1,
        text: 'Hello World'
      },
      {
        fbid: 2,
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
          expect(mockBot.run.calls.argsFor(0)).toEqual([1, 'Hello World', { test: 'test' }, jasmine.any(Function)]);
          expect(mockBot.run.calls.argsFor(1)).toEqual([2, 'Hello World 2', {}, jasmine.any(Function)]);
          done();
        }
      });
  });

  it('should update the context with a new one', (done) => {
    let inMessage = createIncomingMessages([
      {
        fbid: 1,
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
          expect(sessions.get(1)).toEqual(newContext);
          done();
        }
      });
  });

  it('should send a text message to a user', () => {
    let request = nock('https://graph.facebook.com/me')
      .post('/messages', {
        recipient: {
          id: 1
        },
        message: {
          text: 'hello, world!'
        }
      })
      .query({
        access_token: PAGE_TOKEN
      })
      .reply(200);
    fb.sendText(1, 'hello, world!');
    expect(request.isDone()).toBe(true);
  });

  it('should send a navigation url', () => {
    let request = nock('https://graph.facebook.com/me')
      .post('/messages', {
        recipient: {
          id: 1
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
                  url: 'http://maps.google.com',
                  title: 'Follow me!'
                }]
              }]
            }
          }
        }
      })
      .query({
        access_token: PAGE_TOKEN
      })
      .reply(200);
    fb.sendNavigation(1, 'http://maps.google.com');
    expect(request.isDone()).toBe(true);
  });

});
