import * as t from '@babel/types';
import _ from 'lodash/fp';
import {
  hashNode,
  flattenLogicalExpression,
  createLogicalAndExpression,
  isNestedLogicalAndExpression,
} from '../utils/helpers';
import generate from '@babel/generator';

function matchLeftOrRight(node, check) {
  return check(node.left) || check(node.right);
}

function combineFromArray(arr) {
  // x === 'foo', 'foo' === x, x.y === 'foo', 'foo' === x.y
  const [match, noMatch] = _.partition(itm => {
    return checkItem(itm);

    function checkItem(item) {
      if (isNestedLogicalAndExpression(item)) {
        return checkItem(item.left);
      }

      if (
        t.isBinaryExpression(item, { operator: '===' }) &&
        matchLeftOrRight(item, t.isStringLiteral) &&
        (matchLeftOrRight(item, t.isMemberExpression) || matchLeftOrRight(item, t.isIdentifier))
      ) {
        return true;
      }
      return false;
    }
  }, arr);

  if (match.length === 0) {
    return arr;
  }

  const newArgs = _.flow(
    _.map(flattenLogicalExpression),

    // Set the string to always be on the right side of ===
    // Simplifies the rest of the code
    _.map(row => {
      let tempNode = { ...row[0] };

      if (t.isStringLiteral(tempNode.left)) {
        tempNode = t.binaryExpression('===', tempNode.right, tempNode.left);
      }

      return [tempNode, ...row.slice(1)];
    }),

    // Group on whatever the strings are compared to
    _.groupBy(row => hashNode(row[0].left)),

    // Removes the key created by groupBy
    _.values,

    // Create the objects
    _.map(group => {
      const properties = group.reduce((acc, row) => {
        let key = row[0].right;
        // If possible, use a identifier as the key, saves 2 characters
        if (/[^A-Za-z]/.test(row[0].right.value) === false) {
          key = t.identifier(row[0].right.value);
        }

        acc.push(t.objectProperty(key, createLogicalAndExpression(row.slice(1))));
        return acc;
      }, []);

      const lookupExpression = t.memberExpression(
        t.objectExpression(properties),
        group[0][0].left,
        true,
      );
      if (group.length > 1) {
        return lookupExpression;
      }

      // If the size is the same, use the original
      const original = createLogicalAndExpression(group[0]);
      const a = generate(original, { compact: true }).code;
      const b = generate(lookupExpression, { compact: true }).code;
      return a.length <= b.length ? original : lookupExpression;
    }),
  )(match);

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

export default {
  CallExpression(path) {
    path.traverse(arrayVisitor);
    path.node.arguments = combineFromArray(path.node.arguments);
  },
};
