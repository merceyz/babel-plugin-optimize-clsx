const t = require('@babel/types');
const generateBooleanArgument = require('./generateBooleanArgument');

module.exports = path => {
  const args = path.node.arguments;
  const newArguments = [];

  for (const argument of args) {
    if (t.isObjectExpression(argument)) {
      for (const p of argument.properties) {
        newArguments.push(generateBooleanArgument(p));
      }
    } else {
      newArguments.push(argument);
    }
  }

  path.node.arguments = newArguments;
};
