'use strict';

// When not cloning the `node-wit` repo, replace the `require` like so:
// const Wit = require('node-wit').Wit;
const Wit = require('node-wit').Wit;

const token = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/template.js <wit-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

const maybeGetFirstValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  say: (sessionId, context, message, cb) => {
    console.log(message);
    cb();
  },
  merge: (sessionId, context, entities, message, cb) => {
    let query = maybeGetFirstValue(entities, 'guide_building');
    let room = maybeGetFirstValue(entities, 'number');
    cb(context);
  },
  error: (sessionId, context, err) => {
    console.log(err.message);
  },
  search: (sessionId, context, cb) => {
    context.floor = 'first';
    // TODO: get coordinates from DB
    context.url = `http://www.google.com/maps?saddr=My+Location&daddr=32.7745127,35.0231037`;
    cb(context);
  }
};

const client = new Wit(token, actions);
client.interactive();
