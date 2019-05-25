import { getOptions } from './options';
import findFunctionNames from './visitors/findFunctionNames';
import extractObjectProperties from './visitors/extractObjectProperties';
import propTypes from './visitors/propTypes';
import stripLiterals from './visitors/stripLiterals';
import combineStringLiterals from './visitors/combineStringLiterals';
import combineArguments from './visitors/combineArguments';
import createConditionalExpression from './visitors/createConditionalExpression';
import removeUnnecessaryCalls from './visitors/removeUnnecessaryCalls';

const visitors = [
  findFunctionNames,
  extractObjectProperties,
  propTypes,
  stripLiterals,
  combineStringLiterals,
  combineArguments,
  createConditionalExpression,
  removeUnnecessaryCalls,
];

export default () => ({
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
