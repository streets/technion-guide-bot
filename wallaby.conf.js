module.exports = function (w) {
  'use strict';
  w.defaults.files.instrument = false;
  return {
    files: [
      'src/**/*.ts'
    ],
    tests: [
      'spec/**/*.spec.ts'
    ],
    testFramework: 'jasmine',
    env: {
      type: 'node'
    }
  };
};