require('@yarnpkg/pnpify').patchFs();
const { jsWithTs } = require('ts-jest/presets');
const path = require('path');

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  testRegex: `test/index.js`,
  transform: jsWithTs.transform,
  globals: {
    'ts-jest': {
      packageJson: path.join(__dirname, 'package.json'),
    },
  },
};
