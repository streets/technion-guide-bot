"use strict";
const request = require('superagent');
class Firebase {
    getBuildings() {
        return new Promise((resolve, reject) => {
            request
                .get('https://technion-map-db.firebaseio.com/.json')
                .type('json')
                .end((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Firebase;
//# sourceMappingURL=firebase.module.js.map