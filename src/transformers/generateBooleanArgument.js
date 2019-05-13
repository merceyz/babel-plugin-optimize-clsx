const t = require('@babel/types');

module.exports = path => {
  const rightOperand = path.computed
    ? path.key
    : t.isStringLiteral(path.key)
    ? path.key
    : t.stringLiteral(path.key.name);

  return t.LogicalExpression('&&', path.value, rightOperand);
};
