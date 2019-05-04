const t = require('@babel/types');

module.exports = args => {
  const newArguments = [];

  for (const argument of args) {
    if (argument.type === 'ObjectExpression') {
      for (const p of argument.properties) {
        newArguments.push(t.LogicalExpression('&&', p.value, p.key));
      }
    } else {
      newArguments.push(argument);
    }
  }

  return newArguments;
};
