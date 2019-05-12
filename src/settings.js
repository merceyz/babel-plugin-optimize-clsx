const extend = require('lodash/extend');

const DefaultSettings = {
  libraries: ['clsx', 'classnames'],
  functionNames: [],
};

module.exports = options => {
  return extend({}, DefaultSettings, options);
};
