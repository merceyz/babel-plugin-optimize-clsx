const t = require('@babel/types');
const _ = require('lodash');

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    if (path.node.arguments.length < 2) return;

    const [match, noMatch] = _.partition(path.node.arguments, t.isStringLiteral);
    if (match.length < 2) return;

    const result = match.reduce((prev, curr) => t.stringLiteral(prev.value + ' ' + curr.value));
    path.node.arguments = [result, ...noMatch];
  },
};

module.exports = (path, options) => {
  if (!t.isProgram(path.node)) {
    throw new Error('Node has to be a program node');
  }

  path.traverse(visitor, { options });
};
