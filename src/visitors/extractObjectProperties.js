import * as t from '@babel/types';
import _ from 'lodash';

export default {
  CallExpression(path) {
    path.node.arguments = _.flatMap(path.node.arguments, node => {
      if (!t.isObjectExpression(node)) {
        return node;
      }

      return node.properties.map(p => {
        function getKey() {
          return p.computed
            ? p.key
            : t.isStringLiteral(p.key)
            ? p.key
            : t.stringLiteral(p.key.name);
        }

        if (t.isSpreadElement(p)) {
          return p.argument;
        } else if (t.isObjectMethod(p)) {
          return getKey();
        } else {
          return t.logicalExpression('&&', p.value, getKey());
        }
      });
    });
  },
};
