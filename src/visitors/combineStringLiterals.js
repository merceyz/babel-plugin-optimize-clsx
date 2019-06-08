import * as t from '@babel/types';
import _ from 'lodash';

function combineStringsInArray(array) {
  if (array.length < 2) {
    return array;
  }

  const [match, noMatch] = _.partition(
    array,
    item => t.isStringLiteral(item) || t.isTemplateLiteral(item),
  );

  if (match.length < 2) {
    return array;
  }

  const [strings, templates] = _.partition(match, t.isStringLiteral);

  const expressions = [];
  const quasis = [];

  // Combine string literals
  if (strings.length > 0) {
    quasis.push(
      templateElement(
        strings.reduce((prev, curr) => t.stringLiteral(prev.value + ' ' + curr.value)).value,
        true,
      ),
    );
  }

  // Combine template literals
  templates.forEach(item => {
    if (item.expressions.length === 0) {
      const newValue = item.quasis.reduce((prev, curr) =>
        templateElement(prev.value.raw + ' ' + curr.value.raw, true),
      );

      if (quasis.length === 0) {
        quasis.push(newValue);
        return;
      }

      const prevItem = quasis[quasis.length - 1];
      quasis[quasis.length - 1] = templateElement(
        prevItem.value.raw + ' ' + newValue.value.raw,
        true,
      );
      return;
    }

    item.quasis.forEach(item => {
      if (quasis.length !== 0) {
        const prevItem = quasis[quasis.length - 1];

        if (item.tail === false && prevItem.tail) {
          quasis[quasis.length - 1] = templateElement(
            prevItem.value.raw + ' ' + item.value.raw,
            true,
          );
          return;
        }
      }

      quasis.push(item);
    });

    expressions.push(...item.expressions);
  });

  if (expressions.length === 0 && quasis.length === 1) {
    return [t.stringLiteral(quasis[0].value.raw), ...noMatch];
  }

  return [t.templateLiteral(quasis, expressions), ...noMatch];
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

function templateElement(value, tail = false) {
  return {
    type: 'TemplateElement',
    value: {
      raw: value,
    },
    tail,
  };
}
