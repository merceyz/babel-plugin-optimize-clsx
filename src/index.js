const t = require('@babel/types');
const getOptions = require('./options');

const transformers = [
  require('./transformers/extractObjectProperties'),
  require('./transformers/combineArguments'),
  require('./transformers/createConditionalExpression'),
];

module.exports = () => {
  let options = null;
  return {
    visitor: {
      Program(path, state) {
        options = getOptions(state.opts);
      },
      ImportDeclaration(path) {
        const { node } = path;
        if (options.libraries.includes(node.source.value)) {
          node.specifiers.forEach(spec => {
            if (t.isImportDefaultSpecifier(spec)) {
              options.functionNames.push(spec.local.name);
            }
          });
        }
      },
      VariableDeclarator(path) {
        const { init, id } = path.node;
        if (
          t.isCallExpression(init) &&
          t.isIdentifier(init.callee, { name: 'require' }) &&
          init.arguments.length === 1 &&
          t.isLiteral(init.arguments[0]) &&
          options.libraries.includes(init.arguments[0].value)
        ) {
          options.functionNames.push(id.name);
        }
      },
      CallExpression: path => {
        const { callee: c } = path.node;
        if (!t.isIdentifier(c) || !options.functionNames.includes(c.name)) {
          return;
        }

        try {
          transformers.forEach(transformer => transformer(path));
        } catch (err) {
          throw path.buildCodeFrameError(err);
        }
      },
    },
  };
};
