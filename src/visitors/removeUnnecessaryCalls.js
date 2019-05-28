import * as t from '@babel/types';
import { isSafeConditional } from '../utils/helpers';

const transforms = [
  function noArgumentsToString(args) {
    if (args.length === 0) {
      return t.stringLiteral('');
    }
  },

  function singleStringLiteral(args) {
    if (args.length === 1 && t.isStringLiteral(args[0])) {
      return args[0];
    }
  },

  function singleSafeConditional(args) {
    if (args.length === 1 && isSafeConditional(args[0])) {
      return args[0];
    }
  },

  function multipleSafeConditionals(args) {
    if (args.length !== 2) return;

    const [arg1, arg2] = args;

    if (isSafeConditional(arg1) && isSafeConditional(arg2)) {
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
      (isSafeConditional(arg1) || isSafeConditional(arg2))
    ) {
      const string = t.isStringLiteral(arg1) ? arg1 : arg2;
      const conditional = t.isStringLiteral(arg2) ? arg1 : arg2;

      return t.binaryExpression('+', t.stringLiteral(string.value + ' '), conditional);
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
