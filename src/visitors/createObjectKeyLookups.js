import * as t from '@babel/types';
import _ from 'lodash';
import { hashNode } from '../utils/helpers';
import generate from '@babel/generator';

function matchLeftOrRight(node, check) {
  return check(node.left) || check(node.right);
}

function combineFromArray(arr) {
  // x === 'foo', 'foo' === x, x.y === 'foo', 'foo' === x.y
  const [match, noMatch] = _.partition(arr, item => {
    return (
      t.isLogicalExpression(item, { operator: '&&' }) &&
      t.isBinaryExpression(item.left, { operator: '===' }) &&
      matchLeftOrRight(item.left, t.isStringLiteral) &&
      (matchLeftOrRight(item.left, t.isMemberExpression) ||
        matchLeftOrRight(item.left, t.isIdentifier))
    );
  });

  if (match.length === 0) {
    return arr;
  }

  // Make sure the string is on the right side of ===
  // Makes the rest of the code simpler
  const rearranged = match.map(node => {
    const tempNode = { ...node };
    if (t.isStringLiteral(tempNode.left.left)) {
      tempNode.left = t.binaryExpression('===', tempNode.left.right, tempNode.left.left);
    }
    return tempNode;
  });

  // Group on whatever the strings are compared to
  const grouped = _.groupBy(rearranged, node => hashNode(node.left.left));

  const newArgs = [];
  _.forOwn(grouped, item => {
    const result = item.reduce((acc, node) => {
      let key = node.left.right;

      // If possible, use a identifier as the key, saves 2 characters
      if (/[^A-Za-z]/.test(node.left.right.value) === false) {
        key = t.identifier(node.left.right.value);
      }

      acc.push(t.objectProperty(key, node.right));
      return acc;
    }, []);

    const output = t.memberExpression(t.objectExpression(result), item[0].left.left, true);
    if (item.length > 1) {
      newArgs.push(output);
      return;
    }

    // If the size is the same, use the original
    const a = generate(item[0], { compact: true }).code;
    const b = generate(output, { compact: true }).code;
    newArgs.push(a.length <= b.length ? item[0] : output);
  });

  return [...noMatch, ...newArgs];
}

const arrayVisitor = {
  ArrayExpression(path) {
    path.node.elements = combineFromArray(path.node.elements);

    if (path.node.elements.length === 1) {
      path.replaceWith(path.node.elements[0]);
    }
  },
};

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    path.traverse(arrayVisitor);
    path.node.arguments = combineFromArray(path.node.arguments);
  },
};

export default (path, options) => {
  path.traverse(visitor, { options });
};
