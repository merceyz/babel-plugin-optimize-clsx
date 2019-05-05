const t = require('@babel/types');
const compareNodes = require('./compareNodes');

function flattenLogicalOperator(node) {
  if (t.isLogicalExpression(node)) {
    return [...flattenLogicalOperator(node.left), node.right];
  }

  return [node];
}

function isAllLogicalAndOperators(node) {
  if (t.isLogicalExpression(node)) {
    if (node.operator !== '&&') {
      return false;
    }

    return isAllLogicalAndOperators(node.left);
  }

  return true;
}

function filterArray(array, callback) {
  const match = [];
  const noMatch = [];

  for (const item of array) {
    if (callback(item) === true) {
      match.push(item);
    } else {
      noMatch.push(item);
    }
  }

  return [match, noMatch];
}

function getMostFrequentNode(operators) {
  let maxNode = null;
  let maxLength = 0;

  operators.forEach(row => {
    for (let x = 0; x < row.length - 1; x++) {
      const item = row[x];
      let length = 0;

      operators.forEach(row2 => {
        for (let x2 = 0; x2 < row2.length - 1; x2++) {
          const item2 = row2[x2];
          if (compareNodes(item, item2) === true) {
            length += item.end - item.start;
          }
        }
      });

      if (length > maxLength) {
        maxNode = item;
        maxLength = length;
      }
    }
  });

  return maxNode;
}

function stringify(object) {
  function replacer(name, val) {
    if (name === 'start' || name === 'loc' || name === 'end') {
      return undefined;
    }
    return val;
  }

  return JSON.stringify(object, replacer, 1);
}

module.exports = {
  flattenLogicalOperator,
  isAllLogicalAndOperators,
  filterArray,
  getMostFrequentNode,
  stringify,
};
