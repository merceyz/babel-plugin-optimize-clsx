import _ from 'lodash';
import { isStringLike, combineStringLike } from '../utils/strings';

function combineStringsInArray(array) {
  if (array.length < 2) {
    return array;
  }

  const [match, noMatch] = _.partition(array, isStringLike);

  if (match.length < 2) {
    return array;
  }

  return [match.reduce(combineStringLike), ...noMatch];
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

export const combineStringLiterals = ({ expression: path }) => {
  path.node.arguments = combineStringsInArray(path.node.arguments);
  path.traverse(arrayVisitor);
};
