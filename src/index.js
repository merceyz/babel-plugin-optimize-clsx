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
import { performance } from 'perf_hooks';

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

let totalTime = 0;
let totalCount = 0;
function profile(func) {
  const before = performance.now();
  func();
  const after = performance.now();
  totalTime += after - before;
  console.log('Run: %d - Total time: %d', ++totalCount, totalTime);
}

export default () => ({
  visitor: {
    Program(path, state) {
      const options = getOptions(state.opts);
      findFunctionNames(path, options);

      if (options.functionNames.length === 0) {
        return;
      }

      profile(() => {
        try {
          for (const visitor of visitors) {
            visitor(path, options);
          }
        } catch (err) {
          throw err;
        }
      });
    },
  },
});
