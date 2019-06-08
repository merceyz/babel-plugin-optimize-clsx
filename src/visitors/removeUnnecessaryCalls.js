import * as t from '@babel/types';
import { isSafeConditionalExpression } from '../utils/helpers';

const transforms = [
  function noArgumentsToString(args) {
    if (args.length === 0) {
      return t.stringLiteral('');
    }
  },

  function singleStringLiteral(args) {
    if (args.length === 1 && (t.isStringLiteral(args[0]) || t.isTemplateLiteral(args[0]))) {
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

    if (isSafeConditionalExpression(arg1) && isSafeConditionalExpression(arg2)) {
      const newCond = t.conditionalExpression(
        arg1.test,
        t.stringLiteral(arg1.consequent.value + ' '),
        t.stringLiteral(arg1.alternate.value + ' '),
      );

      return t.binaryExpression('+', newCond, arg2);
    }
  },

  function stringAndSafeConditional(args) {
    if (args.length !== 2) return;

    const [arg1, arg2] = args;

    if (
      (t.isStringLiteral(arg1) || t.isStringLiteral(arg2)) &&
      (isSafeConditionalExpression(arg1) || isSafeConditionalExpression(arg2))
    ) {
      const string = t.isStringLiteral(arg1) ? arg1 : arg2;
      const conditional = t.isStringLiteral(arg2) ? arg1 : arg2;

      return t.binaryExpression('+', t.stringLiteral(string.value + ' '), conditional);
    }
  },

  function singleLogicalExpression(args) {
    if (args.length !== 1) return;

    const [arg] = args;
    if (t.isLogicalExpression(arg, { operator: '&&' }) && t.isStringLiteral(arg.right)) {
      return t.conditionalExpression(arg.left, arg.right, t.stringLiteral(''));
    } else if (t.isLogicalExpression(arg, { operator: '||' }) && t.isStringLiteral(arg.right)) {
      // Assume that arg.left returns a string value
      return arg;
    }
  },

  function stringAndLogicalExpression(args) {
    if (args.length !== 2) return;

    const [arg1, arg2] = args;
    if (
      t.isStringLiteral(arg1) &&
      t.isLogicalExpression(arg2, { operator: '&&' }) &&
      t.isStringLiteral(arg2.right)
    ) {
      return t.binaryExpression(
        '+',
        arg1,
        t.conditionalExpression(
          arg2.left,
          t.stringLiteral(' ' + arg2.right.value),
          t.stringLiteral(''),
        ),
      );
    }
  },
];

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    for (const t of transforms) {
      const result = t(path.node.arguments);

      if (result !== undefined) {
        path.replaceWith(result);
        break;
      }
    }
  },
};

export default (path, options) => {
  if (!options.removeUnnecessaryCalls) {
    return;
  }

  path.traverse(visitor, { options });
};
