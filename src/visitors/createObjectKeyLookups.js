import * as t from '@babel/types';
import _ from 'lodash/fp';
import {
  hashNode,
  flattenLogicalExpression,
  createLogicalAndExpression,
  isNestedLogicalAndExpression,
} from '../utils/helpers';

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
      if (group.length === 1) {
        return createLogicalAndExpression(group[0]);
      }

      return t.memberExpression(
        t.objectExpression(
          group.map(row =>
            t.objectProperty(row[0].right, createLogicalAndExpression(row.slice(1))),
          ),
        ),
        group[0][0].left,
        true,
      );
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

export const createObjectKeyLookups = ({ expression: path }) => {
  path.traverse(arrayVisitor);
  path.node.arguments = combineFromArray(path.node.arguments);
};
