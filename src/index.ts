import * as babel from '@babel/core';
import * as t from '@babel/types';

import { getOptions, PluginOptions } from './options';
import { findExpressions, isImportMap } from './findExpressions';

import { collectCalls } from './visitors/collectCalls';
import { extractObjectProperties } from './visitors/extractObjectProperties';
import { flattenArrays } from './visitors/flattenArrays';
import { propTypes } from './visitors/propTypes';
import { optimizeExpressions } from './visitors/optimizeExpressions';
import { stripLiterals } from './visitors/stripLiterals';
import { combineArguments } from './visitors/combineArguments';
import { combineStringLiterals } from './visitors/combineStringLiterals';
import { createConditionalExpression } from './visitors/createConditionalExpression';
import { removeUnnecessaryCalls } from './visitors/removeUnnecessaryCalls';
import { createObjectKeyLookups } from './visitors/createObjectKeyLookups';

const visitors = [
  collectCalls,
  flattenArrays,
  extractObjectProperties,
  propTypes,
  optimizeExpressions,
  stripLiterals,
  combineArguments,
  combineStringLiterals,
  createConditionalExpression,
  removeUnnecessaryCalls,
  createObjectKeyLookups,
];

export default (): babel.PluginObj<{ opts?: Partial<PluginOptions>; filename: string }> => ({
  visitor: {
    Program(path, state) {
      const options = getOptions(state.opts);

      const expressions = findExpressions(path, options);

      if (expressions.length === 0) {
        return;
      }

      const internalState = new Map<string, any>();

      const runVisitors = (expression: babel.NodePath<t.CallExpression>) => {
        for (const visitor of visitors) {
          visitor({
            program: path,
            expression,
            state: internalState,
            options,
            filename: state.filename,
          });

          if (!expression.isCallExpression()) {
            return false;
          }
        }
      };

      for (let x = 0; x < expressions.length; x++) {
        const item = expressions[x];

        if (isImportMap(item)) {
          for (let y = 0; y < item.expressions.length; y++) {
            if (runVisitors(item.expressions[y]) === false) {
              item.expressions.splice(y, 1);
              item.referenceCount -= 1;
              y -= 1;
            }

            if (item.referenceCount === 0) {
              item.source.remove();
              expressions.splice(x, 1);
              x -= 1;
              break;
            }
          }
        } else if (runVisitors(item) === false) {
          expressions.splice(x, 1);
          x -= 1;
        }
      }
    },
  },
});
