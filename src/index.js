const t = require('@babel/types');
const _ = require('lodash');

const transformers = [
  require('./transformers/extractObjectProperties'),
  require('./transformers/combineArguments'),
];

module.exports = () => {
  return {
    visitor: {
      CallExpression: path => {
        const { callee: c } = path.node;
        if (!(t.isIdentifier(c) && (c.name === 'clsx' || c.name === 'classNames'))) return;

        try {
          _.forEach(transformers, transformer => transformer(path));
        } catch (err) {
          throw path.buildCodeFrameError(err);
        }
      },
    },
  };
};
