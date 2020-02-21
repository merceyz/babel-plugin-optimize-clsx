import * as babel from '@babel/core';
import * as t from '@babel/types';
import _ from 'lodash/fp';
import {
  hashNode,
  flattenLogicalExpression,
  createLogicalAndExpression,
  isNestedLogicalAndExpression,
} from '../utils/helpers';
import { VisitorFunction } from '../types';

function matchLeftOrRight(
  node: t.BinaryExpression,
  checkOrChecks: ((node: t.Expression) => boolean) | Array<(node: t.Expression) => boolean>,
) {
  if (!Array.isArray(checkOrChecks)) {
    return checkOrChecks(node.left) || checkOrChecks(node.right);
  }

  for (const _check of checkOrChecks) {
    if (_check(node.left) || _check(node.right)) {
      return true;
    }
  }

  return false;
}

function combineFromArray(arr: t.Expression[]) {
  // x === 'foo', 'foo' === x
  // x.y === 'foo', 'foo' === x.y
  // x?.y === 'foo', 'foo' === x?.y
  const [match, noMatch] = _.partition(itm => {
    return checkItem(itm);

    function checkItem(item: t.Expression): boolean {
      if (isNestedLogicalAndExpression(item)) {
        return checkItem(item.left);
      }

      return (
        t.isBinaryExpression(item, { operator: '===' }) &&
        matchLeftOrRight(item, t.isStringLiteral) &&
        matchLeftOrRight(item, [t.isMemberExpression, t.isIdentifier, t.isOptionalMemberExpression])
      );
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
      const tempNode = row[0] as t.BinaryExpression;

      if (t.isStringLiteral(tempNode.left)) {
        const strNode = tempNode.left;
        tempNode.left = tempNode.right;
        tempNode.right = strNode;
      }

      return row;
    }),

    // Group on whatever the strings are compared to
    _.groupBy(row => hashNode((row[0] as t.BinaryExpression).left)),

    // Removes the key created by groupBy
    _.values,

    // Create the objects
    _.map((group: t.Expression[][]) => {
      if (group.length === 1) {
        return createLogicalAndExpression(group[0]);
      }

      return t.memberExpression(
        t.objectExpression(
          group.map(row =>
            t.objectProperty(
              (row[0] as t.BinaryExpression).right,
              createLogicalAndExpression(row.slice(1)),
            ),
          ),
        ),
        (group[0][0] as t.BinaryExpression).left,
        true,
      );
    }),
  )(match);

  return [...noMatch, ...newArgs];
}

const arrayVisitor: babel.Visitor = {
  ArrayExpression(path) {
    path.node.elements = combineFromArray(path.node.elements as t.Expression[]);

    if (path.node.elements.length === 1) {
      path.replaceWith(path.node.elements[0]!);
    }
  },
};

export const createObjectKeyLookups: VisitorFunction = ({ expression: path }) => {
  path.traverse(arrayVisitor);
  path.node.arguments = combineFromArray(path.node.arguments as t.Expression[]);
};
