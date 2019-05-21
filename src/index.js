const getOptions = require('./options');

const visitors = [
  require('./visitors/findFunctionNames'),
  require('./visitors/extractObjectProperties'),
  require('./visitors/combineArguments'),
  require('./visitors/createConditionalExpression'),
];

module.exports = () => ({
  visitor: {
    Program(path, state) {
      const options = getOptions(state.opts);

      try {
        for (const visitor of visitors) {
          visitor(path, options);

          if (options.functionNames.length === 0) {
            return;
          }
        }
      } catch (err) {
        throw path.buildCodeFrameError(err);
      }
    },
  },
});
