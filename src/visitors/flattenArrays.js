import * as t from '@babel/types';
import _ from 'lodash';

function unwrapArrayExpression(nodes) {
  return nodes.map(item =>
    t.isArrayExpression(item) ? unwrapArrayExpression(item.elements) : item,
  );
}

export default {
  CallExpression(path) {
    path.node.arguments = _.flattenDeep(unwrapArrayExpression(path.node.arguments));
  },
};
