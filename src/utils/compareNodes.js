const isEqualWith = require('lodash/isEqualWith');

module.exports = (obj1, obj2) => {
  return isEqualWith(obj1, obj2, (v1, v2, key) => {
    return key === 'start' || key === 'end' || key === 'loc' ? true : undefined;
  });
};
