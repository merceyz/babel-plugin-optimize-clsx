import * as t from '@babel/types';
import _ from 'lodash';
import { VisitorFunction } from '../types';

export const extractObjectProperties: VisitorFunction = ({ expression }) => {
  expression.node.arguments = _.flatMap(expression.node.arguments, node => {
    if (!t.isObjectExpression(node)) {
      return node;
    }

    return node.properties.map(p => {
      if (t.isSpreadElement(p)) {
        return p.argument;
      } else {
        const getKey = () => {
          return p.computed
            ? p.key
            : t.isStringLiteral(p.key)
            ? p.key
            : t.stringLiteral(p.key.name);
        };

        if (t.isObjectMethod(p)) {
          return getKey();
        } else {
          // @ts-ignore
          return t.logicalExpression('&&', p.value, getKey());
        }
      }
    });
  });
};
