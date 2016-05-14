import * as request from 'superagent';

export default class Firebase {
  getBuildings(): Promise<any> {
    return new Promise((resolve, reject) => {
      request
      .get('https://technion-map-db.firebaseio.com/.json')
      .type('json')
      .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  }
}
