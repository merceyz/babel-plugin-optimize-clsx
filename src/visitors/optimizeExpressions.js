import * as t from '@babel/types';
import * as helpers from '../utils/helpers';
import _ from 'lodash/fp';

function nestedLogicalAndExpression(expressions) {
  return _.flow(
    // Remove duplicates in the same expression
    // foo && bar && bar --> foo && bar
    _.uniqBy(helpers.hashNode),
    // Optimize a single expression
    _.map(expr => {
      // Allows createConditionalExpression to optimize the expression
      // foo % 2 === 1 --> foo % 2 !== 0
      // foo % 2 !== 1 --> foo % 2 === 0
      if (
        t.isBinaryExpression(expr) &&
        (expr.operator === '!==' || expr.operator === '===') &&
        t.isNumericLiteral(expr.right, { value: 1 }) &&
        t.isBinaryExpression(expr.left, { operator: '%' }) &&
        t.isNumericLiteral(expr.left.right, { value: 2 })
      ) {
        expr.right = t.numericLiteral(0);
        expr.operator = expr.operator === '===' ? '!==' : '===';
      }
      return expr;
    }),
  )(expressions);
}

export default {
  CallExpression(path) {
    path.node.arguments = path.node.arguments.map(node => {
      // foo ? bar : '' --> foo && bar
      // foo ? '' : bar --> !foo && bar
      if (t.isConditionalExpression(node)) {
        if (helpers.isNodeFalsy(node.alternate)) {
          node = t.logicalExpression('&&', node.test, node.consequent);
        } else if (helpers.isNodeFalsy(node.consequent)) {
          node = t.logicalExpression('&&', t.unaryExpression('!', node.test), node.alternate);
        }
      }

      // foo && bar && baz ...
      if (helpers.isNestedLogicalAndExpression(node)) {
        node = _.flow(
          helpers.flattenLogicalExpression,
          nestedLogicalAndExpression,
          helpers.createLogicalAndExpression,
        )(node);
      }

      return node;
    });
  },
};
