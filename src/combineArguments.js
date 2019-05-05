const t = require('@babel/types');
const compareNodes = require('./utils/compareNodes');
const helpers = require('./utils/helpers');

module.exports = args => {
  const [match, noMatch] = helpers.filterArray(args, item => {
    return t.isLogicalExpression(item) && helpers.isAllLogicalAndOperators(item);
  });

  // Not enough items to optimize
  if (match.length < 2) return args;

  const operators = match.map(helpers.flattenLogicalOperator);

  const node = helpers.getMostFrequentNode(operators);
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
      if (r.push !== undefined) {
        result.push(...r);
      } else {
        result.push(r);
      }
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
    newNode.child = checkSub(newNode.child);

    return newNode;

    function checkSub(items) {
      if (items.length === 0) return undefined;
      if (items.length === 1) {
        const item = items[0];

        if (item.length === 1) {
          return item[0];
        }

        let result = t.logicalExpression('&&', item.shift(), item.shift());
        while (item.length > 0) {
          result = t.logicalExpression('&&', result, item.shift());
        }

        return result;
      }

      const nextCheck = helpers.getMostFrequentNode(items);
      if (nextCheck !== null) {
        return combineOperators(items, nextCheck);
      }

      return t.arrayExpression(items.map(e => e[0]));
    }
  }
};
