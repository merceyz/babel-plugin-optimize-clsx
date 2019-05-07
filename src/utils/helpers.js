const t = require('@babel/types');
const fs = require('fs');
const path = require('path');
const compareNodes = require('./compareNodes');
const generate = require('@babel/generator');

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

function getMostFrequentNode(operators) {
  let maxNode = null;
  let maxLength = 0;

  operators.forEach((row, row_index) => {
    row.forEach((col, col_index) => {
      if (col_index === row.length - 1) return;
      let length = 0;

      operators.forEach((row2, row2_index) => {
        row2.forEach((col2, col2_index) => {
          // Don't compare against the last item (class) or row, col
          if (
            col2_index === row2.length - 1 ||
            (row_index === row2_index && col_index === col2_index)
          ) {
            return;
          }

          if (compareNodes(col, col2)) {
            length += col.end - col.start;
          }
        });
      });

      if (length > maxLength) {
        maxNode = col;
        maxLength = length;
      }
    });
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

// Used during testing and debugging,
const counts = new Map();
const rootPath = path.join(__dirname, '../../dumps');
function dumpData(obj, name = 'dump', generateCode = false) {
  const data = generateCode ? generate.default(obj).code : stringify(obj);

  const count = counts.get(name) || 0;
  counts.set(name, count + 1);

  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
  }

  fs.writeFileSync(
    path.join(rootPath, name + '_' + count + (generateCode ? '.js' : '.json')),
    data,
  );
}

module.exports = {
  dumpData,
  flattenLogicalOperator,
  isAllLogicalAndOperators,
  getMostFrequentNode,
  stringify,
};
