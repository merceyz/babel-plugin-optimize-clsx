module.exports = function compareNodes(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a !== 'object') {
    return a === b;
  }

  for (const key in a) {
    if (a.hasOwnProperty(key)) {
      // Ignore location data
      if (key === 'start' || key === 'end' || key === 'loc') {
        continue;
      }

      if (b.hasOwnProperty(key) === false) {
        return false;
      }

      if (typeof a[key] === 'object') {
        if (typeof b[key] !== 'object') {
          return false;
        }

        if (compareNodes(a[key], b[key]) === false) {
          return false;
        }

        continue;
      }

      if (a[key] !== b[key]) {
        return false;
      }
    }
  }

  return true;
};
