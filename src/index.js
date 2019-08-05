import { getOptions } from './options';
import findFunctionNames from './visitors/findFunctionNames';
import extractObjectProperties from './visitors/extractObjectProperties';
import propTypes from './visitors/propTypes';
import stripLiterals from './visitors/stripLiterals';
import combineStringLiterals from './visitors/combineStringLiterals';
import combineArguments from './visitors/combineArguments';
import createConditionalExpression from './visitors/createConditionalExpression';
import removeUnnecessaryCalls from './visitors/removeUnnecessaryCalls';
import createObjectKeyLookups from './visitors/createObjectKeyLookups';
import collectCalls from './visitors/collectCalls';
import combineVisitors from './combineVisitors';

const visitors = combineVisitors([
  collectCalls,
  extractObjectProperties,
  propTypes,
  stripLiterals,
  combineArguments,
  combineStringLiterals,
  createConditionalExpression,
  removeUnnecessaryCalls,
  createObjectKeyLookups,
  (path, options) => findFunctionNames(path, { ...options, _removeUnusedImports: true }),
]);

export default () => ({
  visitor: {
    Program(path, state) {
      const options = getOptions(state.opts);
      findFunctionNames(path, options);

      if (options.functionNames.length === 0) {
        return;
      }

      try {
        for (const visitor of visitors) {
          visitor(path, options);
        }
      } catch (err) {
        throw err;
      }
    },
  },
});
