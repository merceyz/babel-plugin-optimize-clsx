import * as babel from '@babel/core';
import _ from 'lodash';
import { isStringLike, combineStringLike } from '../utils/strings';
import { VisitorFunction } from '../types';

function combineStringsInArray(array: unknown[]): any[] {
  if (array.length < 2) {
    return array;
  }

  const [match, noMatch] = _.partition(array, isStringLike);

  if (match.length < 2) {
    return array;
  }

  return [match.reduce(combineStringLike), ...noMatch];
}

const arrayVisitor: babel.Visitor = {
  ArrayExpression(path) {
    const { node } = path;
    node.elements = combineStringsInArray(node.elements);

    if (node.elements.length === 1 && node.elements[0]) {
      path.replaceWith(node.elements[0]);
    }
  },
};

export const combineStringLiterals: VisitorFunction = ({ expression: path }) => {
  path.node.arguments = combineStringsInArray(path.node.arguments);
  path.traverse(arrayVisitor);
};
