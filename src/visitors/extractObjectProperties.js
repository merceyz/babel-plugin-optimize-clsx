const t = require('@babel/types');

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    const args = path.node.arguments;
    const newArguments = [];

    for (const argument of args) {
      if (t.isObjectExpression(argument)) {
        for (const p of argument.properties) {
          newArguments.push(
            t.LogicalExpression(
              '&&',
              p.value,
              p.computed ? p.key : t.isStringLiteral(p.key) ? p.key : t.stringLiteral(p.key.name),
            ),
          );
        }
      } else {
        newArguments.push(argument);
      }
    }

    path.node.arguments = newArguments;
  },
};

module.exports = (path, options) => {
  if (!t.isProgram(path.node)) {
    throw new Error('Node has to be a program node');
  }

  path.traverse(visitor, { options });
};
