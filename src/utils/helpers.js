import * as t from '@babel/types';
import fs from 'fs';
import path from 'path';
import generate from '@babel/generator';
import _ from 'lodash';

export function flattenLogicalOperator(node) {
  if (t.isLogicalExpression(node)) {
    return [...flattenLogicalOperator(node.left), node.right];
  }

  return [node];
}

export function isAllLogicalAndOperators(node) {
  if (t.isLogicalExpression(node)) {
    if (node.operator !== '&&') {
      return false;
    }

    return isAllLogicalAndOperators(node.left);
  }

  return true;
}

export function getMostFrequentNode(operators) {
  let maxNode = null;
  let maxCount = 0;

  operators.forEach((row, row_index) => {
    row.forEach((col, col_index) => {
      if (col_index === row.length - 1) return;
      let count = 0;

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
            count += 1;
          }
        });
      });

      if (count > maxCount) {
        maxNode = col;
        maxCount = count;
      }
    });
  });

  return maxNode;
}

export function stringify(object) {
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
export function dumpData(obj, name = 'dump', generateCode = false) {
  const data = generateCode ? generate(obj).code : stringify(obj);

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

export function compareNodes(obj1, obj2) {
  if (t.isLiteral(obj1) && t.isLiteral(obj2)) {
    return obj1.value === obj2.value;
  } else if (t.isMemberExpression(obj1) && t.isMemberExpression(obj2)) {
    return compareNodes(obj1.object, obj2.object) && compareNodes(obj1.property, obj2.property);
  } else if (t.isIdentifier(obj1) && t.isIdentifier(obj2)) {
    return obj1.name === obj2.name;
  }

  return _.isEqualWith(obj1, obj2, (v1, v2, key) => {
    return key === 'start' || key === 'end' || key === 'loc' ? true : undefined;
  });
}
