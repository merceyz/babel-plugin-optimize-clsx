import * as t from '@babel/types';
import _ from 'lodash';
import * as helpers from '../utils/helpers';

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    const [match, noMatch] = _.partition(
      path.node.arguments,
      item => t.isLogicalExpression(item) && helpers.isAllLogicalAndOperators(item),
    );

    if (match.length === 0) return;

    const result = match
      .map(helpers.flattenLogicalOperator)
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
      .map(expression => expression.reduce((prev, curr) => t.logicalExpression('&&', prev, curr)));

    path.node.arguments = [...noMatch, ...result];
  },
};

export default (path, options) => {
  path.traverse(visitor, { options });
};
