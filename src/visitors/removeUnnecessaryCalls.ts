import * as t from '@babel/types';
import * as babel from '@babel/core';
import { isSafeConditionalExpression } from '../utils/helpers';
import { isStringLike, combineStringLike, isStringLikeEmpty } from '../utils/strings';
import { VisitorFunction } from '../types';

const transforms: Array<(...args: any[]) => t.Expression | undefined> = [
  function noArgumentsToString() {
    return t.stringLiteral('');
  },

  function singleStringLike(arg) {
    if (isStringLike(arg) || isSafeConditionalExpression(arg)) {
      return arg;
    }
  },

  function multipleSafeConditionals(conditionalOne, conditionalTwo) {
    if (
      isSafeConditionalExpression(conditionalOne) &&
      isSafeConditionalExpression(conditionalTwo)
    ) {
      const newCond = t.conditionalExpression(
        conditionalOne.test,
        combineStringLike(conditionalOne.consequent, t.stringLiteral('')),
        combineStringLike(conditionalOne.alternate, t.stringLiteral('')),
      );

      return t.binaryExpression('+', newCond, conditionalTwo);
    }
  },

  function stringAndSafeConditional(stringLike, conditional) {
    if (isStringLike(stringLike) && isSafeConditionalExpression(conditional)) {
      if (isStringLikeEmpty(conditional.consequent) || isStringLikeEmpty(conditional.alternate)) {
        return t.binaryExpression(
          '+',
          stringLike,
          t.conditionalExpression(
            conditional.test,
            combineStringLike(t.stringLiteral(''), conditional.consequent),
            combineStringLike(t.stringLiteral(''), conditional.alternate),
          ),
        );
      }

      return t.binaryExpression(
        '+',
        combineStringLike(stringLike, t.stringLiteral('')),
        conditional,
      );
    }
  },

  function singleLogicalExpression(logicalExpr) {
    if (
      t.isLogicalExpression(logicalExpr, { operator: '&&' }) &&
      (isStringLike(logicalExpr.right) ||
        isSafeConditionalExpression(logicalExpr.right) ||
        (t.isBinaryExpression(logicalExpr.right, { operator: '+' }) &&
          isStringLike(logicalExpr.right.left) &&
          isSafeConditionalExpression(logicalExpr.right.right)))
    ) {
      return t.conditionalExpression(logicalExpr.left, logicalExpr.right, t.stringLiteral(''));
    }
  },

  function stringAndLogicalExpression(stringLike, logicalExpr) {
    if (
      isStringLike(stringLike) &&
      t.isLogicalExpression(logicalExpr, { operator: '&&' }) &&
      isStringLike(logicalExpr.right)
    ) {
      return t.binaryExpression(
        '+',
        stringLike,
        t.conditionalExpression(
          logicalExpr.left,
          combineStringLike(t.stringLiteral(''), logicalExpr.right),
          t.stringLiteral(''),
        ),
      );
    }
  },
];

function runTransforms(
  path: babel.NodePath,
  elements: t.CallExpression['arguments'] | t.ArrayExpression['elements'],
) {
  const reversed = [...elements].reverse();

  for (const tr of transforms) {
    if (tr.length !== elements.length) {
      continue;
    }

    const result = tr.apply(undefined, elements) ?? tr.apply(undefined, reversed);

    if (result !== undefined) {
      path.replaceWith(result);
      break;
    }
  }
}

const arrayVisitor: babel.Visitor = {
  ArrayExpression(path) {
    runTransforms(path, path.node.elements);
  },
};

export const removeUnnecessaryCalls: VisitorFunction = ({ expression: path, options }) => {
  if (!options.removeUnnecessaryCalls) {
    return;
  }

  path.traverse(arrayVisitor);
  runTransforms(path, path.node.arguments);
};
