import * as request from 'supertest';
import Server from '../../src/modules/server.module';

describe('Server module', () => {

  let server: Server;

  beforeEach(() => {
    server = new Server({ PORT: 9876 });
    server.start();
  });

  afterEach(() => {
    server.stop();
  });

  it('should return health', (done) => {
    request(server.server)
      .get('/')
      .expect('Hello Techion Bot!')
      .end((err, res) => (err) ? done.fail(err) : done());
  });

});
