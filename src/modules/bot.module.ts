const container = require('kontainer-di');
export default class Bot {
  constructor() {
    console.log('I am Bot!');
  }

  run() {
    var fb = container.get('facebook');
    console.log('I am running action');
    fb.send();
  }
}
