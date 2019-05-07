const t = require('@babel/types');
const extractArguments = require('./extractArguments');
const combineArguments = require('./combineArguments');

const LIBS = ['clsx', 'classnames'];

module.exports = () => {
  let names = [];
  return {
    visitor: {
      Program: {
        enter() {
          names = [];
        },
      },
      ImportDeclaration(path) {
        const { node } = path;
        if (!LIBS.includes(node.source.value)) return;
        node.specifiers.forEach(spec => {
          if (t.isImportDefaultSpecifier(spec)) {
            names.push(spec.local.name);
          }
        });
      },
      VariableDeclarator(path) {
        const { node } = path;
        if (!t.isCallExpression(node.init)) return;
        if (node.init.callee.name !== 'require') return;
        names.push(node.id.name);
      },
      CallExpression: path => {
        const { node } = path;
        const { callee: c } = node;
        if (t.isIdentifier(c) && names.includes(c.name)) {
          try {
            let args = node.arguments;
            args = extractArguments(args);
            args = combineArguments(args);
            node.arguments = args;
          } catch (err) {
            throw path.buildCodeFrameError(err);
          }
        }
      },
    },
  };
};
