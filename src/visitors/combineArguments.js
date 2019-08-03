import * as t from '@babel/types';
import _ from 'lodash';
import * as helpers from '../utils/helpers';

export default {
  CallExpression(path) {
    // Not enough arguments to optimize
    if (path.node.arguments.length < 2) return;

    const [match, noMatch] = _.partition(path.node.arguments, helpers.isNestedLogicalAndExpression);

    // Not enough arguments to optimize
    if (match.length < 2) return;

    const operators = match.map(helpers.flattenLogicalExpression);

    const node = helpers.getMostFrequentNode(operators);
    // No nodes appear more than once
    if (node === null) return;

    const rootNode = combineOperators(operators, node);

    const newAST = convertToAST(rootNode);

    path.node.arguments = [...noMatch, ...newAST];
    return;

    function convertToAST(node) {
      if (node.type !== 'rootNode') {
        return node;
      }

      const result = [];

      if (node.child.type === 'rootNode') {
        let right = convertToAST(node.child);
        if (right.length === 1) {
          right = right[0];
        } else {
          right = t.arrayExpression(right);
        }
        result.push(t.logicalExpression('&&', node.node, right));
      } else {
        result.push(t.logicalExpression('&&', node.node, node.child));
      }

      if (node.next !== undefined) {
        const r = convertToAST(node.next);
        _.isArray(r) ? result.push(...r) : result.push(r);
      }

      return result;
    }

    function combineOperators(operators, node) {
      const newNode = {
        type: 'rootNode',
        node: node,
        child: [],
        next: [],
      };

      operators.forEach(row => {
        const filtered = row.filter(item => !helpers.compareNodes(item, node));
        if (filtered.length === row.length) {
          newNode.next.push(row);
        } else {
          newNode.child.push(filtered);
        }
      });

      newNode.next = checkSub(newNode.next);

      const child = checkSub(newNode.child);
      if (_.isArray(child)) {
        newNode.child = child.length === 1 ? child[0] : t.arrayExpression(child);
      } else {
        newNode.child = child;
      }

      return newNode;

      function checkSub(items) {
        if (items.length === 0) return undefined;

        if (items.length > 1) {
          const nextCheck = helpers.getMostFrequentNode(items);
          if (nextCheck !== null) {
            return combineOperators(items, nextCheck);
          }
        }

        return items.map(helpers.createLogicalAndExpression);
      }
    }
  },
};
