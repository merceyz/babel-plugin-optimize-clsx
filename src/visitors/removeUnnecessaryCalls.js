import * as t from '@babel/types';
import { isSafeConditionalExpression } from '../utils/helpers';
import { isStringLike, combineStringLike, isStringLikeEmpty } from '../utils/strings';

const transforms = [
  function noArgumentsToString(args) {
    if (args.length === 0) {
      return t.stringLiteral('');
    }
  },

  function singleStringLiteral(args) {
    if (args.length === 1 && isStringLike(args[0])) {
      return args[0];
    }
  },

  function singleSafeConditional(args) {
    if (args.length === 1 && isSafeConditionalExpression(args[0])) {
      return args[0];
    }
  },

  function multipleSafeConditionals(args) {
    if (args.length !== 2) return;

    const [arg1, arg2] = args;

    if (args.every(isSafeConditionalExpression)) {
      const newCond = t.conditionalExpression(
        arg1.test,
        combineStringLike(arg1.consequent, t.stringLiteral('')),
        combineStringLike(arg1.alternate, t.stringLiteral('')),
      );

      return t.binaryExpression('+', newCond, arg2);
    }
  },

  function stringAndSafeConditional(args) {
    if (args.length !== 2) return;

    const [arg1, arg2] = args;

    if (args.some(isStringLike) && args.some(isSafeConditionalExpression)) {
      const string = isStringLike(arg1) ? arg1 : arg2;
      const conditional = isStringLike(arg2) ? arg1 : arg2;

      if (isStringLikeEmpty(conditional.consequent) || isStringLikeEmpty(conditional.alternate)) {
        return t.binaryExpression(
          '+',
          string,
          t.conditionalExpression(
            conditional.test,
            combineStringLike(t.stringLiteral(''), conditional.consequent),
            combineStringLike(t.stringLiteral(''), conditional.alternate),
          ),
        );
      }

      return t.binaryExpression('+', combineStringLike(string, t.stringLiteral('')), conditional);
    }
  },

  function singleLogicalExpression(args) {
    if (args.length !== 1) return;

    const [arg] = args;
    if (
      t.isLogicalExpression(arg, { operator: '&&' }) &&
      (isStringLike(arg.right) ||
        isSafeConditionalExpression(arg.right) ||
        (t.isBinaryExpression(arg.right, { operator: '+' }) &&
          isStringLike(arg.right.left) &&
          isSafeConditionalExpression(arg.right.right)))
    ) {
      return t.conditionalExpression(arg.left, arg.right, t.stringLiteral(''));
    } else if (t.isLogicalExpression(arg, { operator: '||' }) && isStringLike(arg.right)) {
      // Assume that arg.left returns a string value
      return arg;
    }
  },

  function stringAndLogicalExpression(args) {
    if (args.length !== 2) return;

    const [arg1, arg2] = args;
    if (
      isStringLike(arg1) &&
      t.isLogicalExpression(arg2, { operator: '&&' }) &&
      isStringLike(arg2.right)
    ) {
      return t.binaryExpression(
        '+',
        arg1,
        t.conditionalExpression(
          arg2.left,
          combineStringLike(t.stringLiteral(''), arg2.right),
          t.stringLiteral(''),
        ),
      );
    }
  },
];

const arrayVisitor = {
  ArrayExpression(path) {
    for (const tr of transforms) {
      const result = tr(path.node.elements);

      if (result !== undefined) {
        path.replaceWith(result);
        break;
      }
    }
  },
};

export const removeUnnecessaryCalls = ({ expression: path, options }) => {
  if (!options.removeUnnecessaryCalls) {
    return;
  }

  path.traverse(arrayVisitor);

  for (const tr of transforms) {
    const result = tr(path.node.arguments);

    if (result !== undefined) {
      path.replaceWith(result);
      break;
    }
  }
};
