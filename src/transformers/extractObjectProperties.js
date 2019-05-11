const t = require('@babel/types');

module.exports = path => {
  const args = path.node.arguments;
  const newArguments = [];

  for (const argument of args) {
    if (t.isObjectExpression(argument)) {
      for (const p of argument.properties) {
        newArguments.push(t.LogicalExpression('&&', p.value, p.key));
      }
    } else {
      newArguments.push(argument);
    }
  }

  path.node.arguments = newArguments;
};
