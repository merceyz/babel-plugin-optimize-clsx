import * as t from '@babel/types';
import _ from 'lodash';
import * as helpers from '../utils/helpers';
import { isStringLikeEmpty } from '../utils/strings';

export default {
  CallExpression(path) {
    const [match, noMatch] = _.partition(path.node.arguments, helpers.isNestedLogicalAndExpression);

    const result = match
      .map(helpers.flattenLogicalExpression)
      .map(expression =>
        expression.filter((item, index) => {
          if (t.isBooleanLiteral(item, { value: true })) {
            return false;
          }
          if (index !== expression.length - 1 && t.isStringLiteral(item) && item.value.length > 0) {
            return false;
          }
          return true;
        }),
      )
      // Remove expressions that will always be false
      .filter(expression => !(expression.length === 0 || expression.some(helpers.isNodeFalsy)))
      .map(helpers.createLogicalAndExpression);

    const rest = noMatch
      .map(item => {
        if (t.isConditionalExpression(item)) {
          if (helpers.isNodeFalsy(item.consequent)) {
            item.consequent = t.stringLiteral('');
          }

          if (helpers.isNodeFalsy(item.alternate)) {
            item.alternate = t.stringLiteral('');
          }
        }

        return item;
      })
      .filter(item => !helpers.isNodeFalsy(item));

    path.node.arguments = [...rest, ...result];
  },
};
