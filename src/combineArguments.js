const _ = require('lodash');
const t = require('@babel/types');
const compareNodes = require('./utils/compareNodes');
const helpers = require('./utils/helpers');

module.exports = args => {
  const [match, noMatch] = _.partition(
    args,
    item => t.isLogicalExpression(item) && helpers.isAllLogicalAndOperators(item),
  );

  // Not enough items to optimize
  if (match.length < 2) return args;

  const operators = match.map(helpers.flattenLogicalOperator);

  const node = helpers.getMostFrequentNode(operators);
  // No nodes appear more than once
  if (node === null) {
    return args;
  }

  const rootNode = combineOperators(operators, node);

  const newAST = convertToAST(rootNode);

  return [...noMatch, ...newAST];

  function convertToAST(node) {
    if (node.type !== 'rootNode') {
      return node;
    }

    const result = [];

    if (node.child.type === 'rootNode') {
      const arr = t.arrayExpression(convertToAST(node.child));
      result.push(t.logicalExpression('&&', node.node, arr));
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
      const filtered = row.filter(item => !compareNodes(item, node));
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

      return items.map(e => {
        if (e.length === 1) return e[0];

        let result = t.logicalExpression('&&', e.shift(), e.shift());
        while (e.length > 0) {
          result = t.logicalExpression('&&', result, e.shift());
        }

        return result;
      });
    }
  }
};
