module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression: ({ node }) => {
        if (node.callee.type === 'Identifier' && node.callee.name === 'clsx') {
          const newArguments = [];

          for (const argument of node.arguments) {
            if (argument.type === 'ObjectExpression') {
              for (const p of argument.properties) {
                newArguments.push(t.LogicalExpression('&&', p.value, p.key));
              }
            } else {
              newArguments.push(argument);
            }
          }

          node.arguments = newArguments;
        }
      },
    },
  };
};
