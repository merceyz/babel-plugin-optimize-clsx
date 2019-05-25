const t = require('@babel/types');
const helper = require('../utils/helpers');
const _ = require('lodash');

const replaceVisitor = {
  BinaryExpression(path) {
    const node = path.node;
    if (
      t.isBinaryExpression(node) &&
      (node.operator === '===' || node.operator === '!==') &&
      (t.isStringLiteral(node.right) || t.isStringLiteral(node.left))
    ) {
      const propType = this.types.find(obj =>
        obj.matches.some(
          item =>
            (obj.isRequired || item.hasDefaultValue) &&
            (helper.compareNodes(node.left, item) || helper.compareNodes(node.right, item)),
        ),
      );
      if (propType === undefined) return;

      const valueToUse =
        propType.optionA.length < propType.optionB.length ? propType.optionA : propType.optionB;

      const target = t.isStringLiteral(node.right) ? 'right' : 'left';
      if (
        node[target].value !== valueToUse &&
        (node[target].value === propType.optionA || node[target].value === propType.optionB)
      ) {
        node[target] = t.stringLiteral(valueToUse);
        node.operator = node.operator === '!==' ? '===' : '!==';
      }
    }
  },
};

const functionVisitor = {
  'FunctionExpression|FunctionDeclaration'(path) {
    const node = path.node;
    for (const propType of this.propTypes) {
      if (
        t.isFunction(node) &&
        t.isIdentifier(node.id, { name: propType.name }) &&
        node.params.length !== 0
      ) {
        getObjectPattern(node.params[0], null);

        function getObjectPattern(item, matcher) {
          if (_.isArray(item)) {
            for (const obj of item) {
              getObjectPattern(obj, matcher);
            }
            return;
          }

          if (t.isBlockStatement(item)) {
            return getObjectPattern(item.body, matcher);
          }

          if (t.isVariableDeclaration(item)) {
            return getObjectPattern(item.declarations, matcher);
          }

          if (t.isObjectPattern(item)) {
            return getObjectPattern(item.properties, null);
          }

          if (t.isObjectProperty(item) && t.isIdentifier(item.key)) {
            let matchValue = null;
            if (t.isIdentifier(item.value)) {
              matchValue = item.value;
            } else if (t.isAssignmentPattern(item.value)) {
              matchValue = item.value.left;
              matchValue.hasDefaultValue = true;
            } else {
              return;
            }

            propType.values = propType.values.map(prop => {
              if (prop.name !== item.key.name) return prop;

              if (prop.matches === undefined) {
                prop.matches = [];
              }

              return {
                ...prop,
                matches: [...prop.matches, matchValue],
              };
            });
            return;
          }

          if (t.isRestElement(item) && t.isIdentifier(item.argument)) {
            return getObjectPattern(item.argument, null);
          }

          if (t.isIdentifier(item)) {
            propType.values = propType.values.map(prop => {
              if (prop.matches === undefined) {
                prop.matches = [];
              }
              return {
                ...prop,
                matches: [...prop.matches, t.memberExpression(item, t.identifier(prop.name))],
              };
            });

            return getObjectPattern(node.body, item);
          }

          if (t.isVariableDeclarator(item)) {
            if (
              t.isMemberExpression(item.init) &&
              helper.compareNodes(item.init.object, matcher) &&
              t.isIdentifier(item.init.property) &&
              t.isIdentifier(item.id)
            ) {
              propType.values = propType.values.map(prop => {
                if (prop.name !== item.init.property.name) return prop;

                if (prop.matches === undefined) {
                  prop.matches = [];
                }
                return {
                  ...prop,
                  matches: [...prop.matches, item.id],
                };
              });
            } else if (
              t.isIdentifier(item.init) &&
              helper.compareNodes(item.init, matcher) &&
              t.isObjectPattern(item.id)
            ) {
              return getObjectPattern(item.id, null);
            }
          }
        }

        path.traverse(replaceVisitor, { types: propType.values });
      }
    }
  },
};

function getPropTypes(body) {
  const propTypeName = getPropTypesName(body);
  if (propTypeName === undefined) return [];

  const result = [];

  for (const node of body) {
    if (t.isExpressionStatement(node)) {
      const expr = node.expression;
      if (
        t.isAssignmentExpression(expr, { operator: '=' }) &&
        t.isMemberExpression(expr.left) &&
        t.isIdentifier(expr.left.property, { name: 'propTypes' }) &&
        t.isIdentifier(expr.left.object)
      ) {
        let propType = {
          name: expr.left.object.name,
          values: [],
        };

        if (t.isObjectExpression(expr.right)) {
          for (const prop of expr.right.properties) {
            getArrayElements(prop.value, false);

            function getArrayElements(element, isRequired) {
              if (
                t.isMemberExpression(element) &&
                t.isIdentifier(element.property, { name: 'isRequired' })
              ) {
                getArrayElements(element.object, true);
              } else if (
                t.isCallExpression(element) &&
                t.isMemberExpression(element.callee) &&
                t.isIdentifier(element.callee.object, { name: propTypeName }) &&
                t.isIdentifier(element.callee.property, { name: 'oneOf' }) &&
                element.arguments.length === 1
              ) {
                const value = element.arguments[0];
                if (
                  t.isArrayExpression(value) &&
                  value.elements.length === 2 &&
                  t.isStringLiteral(value.elements[0]) &&
                  t.isStringLiteral(value.elements[1])
                ) {
                  propType.values.push({
                    name: prop.key.name,
                    isRequired: isRequired,
                    optionA: value.elements[0].value,
                    optionB: value.elements[1].value,
                  });
                }
              }
            }
          }
        }

        if (propType.values.length !== 0) {
          result.push(propType);
        }
      }
    }
  }

  return result;
}

function getPropTypesName(body) {
  for (const node of body) {
    if (
      t.isImportDeclaration(node) &&
      node.source.value === 'prop-types' &&
      node.specifiers.length === 1
    ) {
      const spec = node.specifiers[0];
      if (t.isImportDefaultSpecifier(spec)) {
        return spec.local.name;
      }
    }
  }
}

module.exports = (path, options) => {
  const propTypes = getPropTypes(path.node.body);
  if (propTypes.length === 0) return;

  path.traverse(functionVisitor, { options, propTypes });
};
