import * as t from '@babel/types';
import fs from 'fs';
import path from 'path';
import generate from '@babel/generator';
import _ from 'lodash';
import hash from 'object-hash';
import { isStringLike, isStringLikeEmpty } from './strings';

export function flattenLogicalExpression(rootNode) {
  const result = [];
  checkNode(rootNode);
  return result;

  function checkNode(node) {
    if (t.isLogicalExpression(node)) {
      checkNode(node.left);
      result.push(node.right);
    } else {
      result.push(node);
    }
  }
}

export function isNestedLogicalAndExpression(node) {
  if (!t.isLogicalExpression(node, { operator: '&&' })) {
    return false;
  }

  let temp = node.left;
  while (t.isLogicalExpression(temp)) {
    if (temp.operator !== '&&') {
      return false;
    }

    temp = temp.left;
  }

  return true;
}

export function getMostFrequentNode(operators) {
  let maxNode = null;
  let maxCount = 0;
  let operators_n = operators.length;

  for (let y = 0, y_n = operators_n - 1; y < y_n; y++) {
    for (let x = 0, row = operators[y], x_n = row.length - 1; x < x_n; x++) {
      let col = row[x];
      let count = 0;

      for (let y2 = y + 1; y2 < operators_n; y2++) {
        for (let x2 = 0, row2 = operators[y2]; x2 < row2.length - 1; x2++) {
          if (compareNodes(col, row2[x2])) {
            count += 1;
          }
        }
      }

      if (count > maxCount) {
        maxNode = col;
        maxCount = count;
      }
    }
  }

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
  if (obj1.type !== obj2.type) {
    return false;
  }

  switch (obj1.type) {
    case 'Identifier':
      return obj1.name === obj2.name;
    case 'MemberExpression':
      return compareNodes(obj1.object, obj2.object) && compareNodes(obj1.property, obj2.property);
    case 'BinaryExpression':
      return (
        obj1.operator === obj2.operator &&
        compareNodes(obj1.left, obj2.left) &&
        compareNodes(obj1.right, obj2.right)
      );
    default: {
      if (t.isLiteral(obj1)) {
        return obj1.value === obj2.value;
      }
      return _.isEqualWith(obj1, obj2, (v1, v2, key) =>
        key === 'start' || key === 'end' || key === 'loc' ? true : undefined,
      );
    }
  }
}

export function hashNode(node) {
  return hash(node, {
    excludeKeys: key =>
      key === 'start' || key === 'end' || key === 'loc' || key === 'extra' ? true : false,
  });
}

export function isSafeConditionalExpression(node) {
  if (!t.isConditionalExpression(node)) {
    return false;
  }

  const { consequent, alternate } = node;

  if (isStringLike(consequent) && isStringLike(alternate)) {
    return true;
  }

  if (
    (isStringLike(consequent) && isSafeConditionalExpression(alternate)) ||
    (isStringLike(alternate) && isSafeConditionalExpression(consequent))
  ) {
    return true;
  }

  return false;
}

export function createLogicalAndExpression(items) {
  return items.reduce((prev, curr) => t.logicalExpression('&&', prev, curr));
}

export function isNodeFalsy(node) {
  return (
    isStringLikeEmpty(node) ||
    t.isNullLiteral(node) ||
    t.isIdentifier(node, { name: 'undefined' }) ||
    t.isBooleanLiteral(node, { value: false }) ||
    t.isNumericLiteral(node, { value: 0 })
  );
}
