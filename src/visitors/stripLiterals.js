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
      .map(expression =>
        expression.some(item => {
          if (t.isBooleanLiteral(item, { value: false })) {
            return true;
          }
          if (t.isStringLiteral(item) && item.value.length === 0) {
            return true;
          }
          return false;
        })
          ? []
          : expression,
      )
      .filter(expression => expression.length !== 0)
      .map(helpers.createLogicalAndExpression);

    const rest = noMatch
      .map(item => {
        if (isStringLikeEmpty(item)) {
          return false;
        }

        if (t.isConditionalExpression(item)) {
          if (t.isNullLiteral(item.consequent)) {
            item.consequent = t.stringLiteral('');
          }

          if (t.isNullLiteral(item.alternate)) {
            item.alternate = t.stringLiteral('');
          }

          if (t.isIdentifier(item.consequent, { name: 'undefined' })) {
            item.consequent = t.stringLiteral('');
          }

          if (t.isIdentifier(item.alternate, { name: 'undefined' })) {
            item.alternate = t.stringLiteral('');
          }
        }

        return item;
      })
      .filter(item => item !== false);

    path.node.arguments = [...rest, ...result];
  },
};
