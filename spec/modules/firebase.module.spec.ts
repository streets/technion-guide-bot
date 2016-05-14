import * as nock from 'nock';
import FirebaseModule from '../../src/modules/firebase.module';

describe('Firebase module', () => {

  let db = new FirebaseModule();

  it('should do request to get building', () => {
    let request = nock('https://technion-map-db.firebaseio.com')
      .get('/.json')
      .reply(200);
    db.getBuildings();
    expect(request.isDone()).toBe(true);
  });
});
