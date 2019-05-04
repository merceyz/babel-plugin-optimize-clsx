const extractArguments = require('./extractArguments');

module.exports = ({ types: t }) => {
  return {
    visitor: {
      CallExpression: ({ node }) => {
        if (node.callee.type === 'Identifier' && node.callee.name === 'clsx') {
          node.arguments = extractArguments(t, node.arguments);
        }
      },
    },
  };
};
