import * as request from 'supertest';
import FacebookModule from '../../src/modules/facebook.module';
import MockServer from '../mocks/server.module.mock';

describe('Facebook module', () => {

  const VERIFY_TOKEN = 'verify-me';
  var fb: FacebookModule;
  var mockServer: MockServer;

  beforeEach(() => {
    mockServer = new MockServer();
    fb = new FacebookModule(
      { FB_VERIFY_TOKEN: VERIFY_TOKEN },
      mockServer,
      { run: jasmine.createSpy('') }
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
});
