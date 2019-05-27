import * as t from '@babel/types';
import _ from 'lodash';

function combineStringsInArray(array) {
  if (array.length < 2) {
    return array;
  }

  const [match, noMatch] = _.partition(array, t.isStringLiteral);

  if (match.length < 2) {
    return array;
  }

  return [match.reduce((prev, curr) => t.stringLiteral(prev.value + ' ' + curr.value)), ...noMatch];
}

const arrayVisitor = {
  ArrayExpression(path) {
    const { node } = path;
    node.elements = combineStringsInArray(node.elements);

    if (node.elements.length === 1) {
      path.replaceWith(node.elements[0]);
    }
  },
};

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    path.node.arguments = combineStringsInArray(path.node.arguments);
    path.traverse(arrayVisitor);
  },
};

export default (path, options) => {
  path.traverse(visitor, { options });
};
