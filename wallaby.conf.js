module.exports = function (w) {
  'use strict';
  w.defaults.files.instrument = false;
  return {
    files: [
      'src/**/*.ts'
    ],
    tests: [
      'spec/mocks/**/*.ts',
      'spec/fixtures/**/*.ts',
      'spec/**/*.spec.ts'
    ],
    testFramework: 'jasmine',
    env: {
      type: 'node'
    }
  };
};
