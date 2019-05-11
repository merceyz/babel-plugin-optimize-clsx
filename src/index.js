const t = require('@babel/types');
const _ = require('lodash');

const transformers = [
  require('./transformers/extractObjectProperties'),
  require('./transformers/combineArguments'),
];

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
      CallExpression: (path, state) => {
        const defaultNames = state.opts.defaultNames || [];
        const { callee: c } = path.node;
        if (!(t.isIdentifier(c) && [...names, ...defaultNames].includes(c.name))) return;

        try {
          _.forEach(transformers, transformer => transformer(path));
        } catch (err) {
          throw path.buildCodeFrameError(err);
        }
      },
    },
  };
};
