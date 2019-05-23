const t = require('@babel/types');

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    const argLength = path.node.arguments.length;
    if (argLength > 0) {
      let arg = path.node.arguments[0];
      if (argLength === 1) {
        if (t.isStringLiteral(arg)) {
          path.replaceWith(arg);
        } else if (isSafeConditional(arg)) {
          path.replaceWith(arg);
        }
      } else if (argLength === 2) {
        let arg2 = path.node.arguments[1];
        if (isSafeConditional(arg) && isSafeConditional(arg2)) {
          const newCond = t.conditionalExpression(
            arg.test,
            t.stringLiteral(arg.consequent.value + ' '),
            t.stringLiteral(arg.alternate.value + ' '),
          );
          path.replaceWith(t.binaryExpression('+', newCond, arg2));
        } else if (
          (t.isStringLiteral(arg) || t.isStringLiteral(arg2)) &&
          (isSafeConditional(arg) || isSafeConditional(arg2))
        ) {
          if (t.isStringLiteral(arg)) {
            path.replaceWith(t.binaryExpression('+', t.stringLiteral(arg.value + ' '), arg2));
          } else {
            path.replaceWith(t.binaryExpression('+', t.stringLiteral(arg2.value + ' '), arg));
          }
        }
      }
    } else if (argLength === 0) {
      path.replaceWith(t.stringLiteral(''));
    }

    function isSafeConditional(node) {
      return (
        t.isConditionalExpression(node) &&
        t.isStringLiteral(node.consequent) &&
        t.isStringLiteral(node.alternate) &&
        node.consequent.value.length > 0 &&
        node.alternate.value.length > 0
      );
    }
  },
};

module.exports = (path, options) => {
  if (!t.isProgram(path.node)) {
    throw new Error('Node has to be a program node');
  }

  if (!options.removeUnnecessaryCalls) {
    return;
  }

  path.traverse(visitor, { options });
};
