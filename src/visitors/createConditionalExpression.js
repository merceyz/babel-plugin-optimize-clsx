import * as t from '@babel/types';
import _ from 'lodash';
import * as helpers from '../utils/helpers';

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    path.node.arguments = combine(path.node.arguments);

    function combine(args) {
      const [match, noMatch] = _.partition(args, helpers.isNestedLogicalAndExpression);

      if (match.length === 0) return noMatch;

      let operators = match
        .map(helpers.flattenLogicalExpression)
        // If the last item in each row is an array, recursivly call ourself
        .map(row => {
          let col = row.pop();

          if (t.isArrayExpression(col)) {
            col.elements = combine(col.elements);
            if (col.elements.length === 1) {
              col = col.elements[0];
            }
          }

          row.push(col);
          return row;
        });

      const result = noMatch;

      for (let row_index = 0; row_index < operators.length; row_index++) {
        const row = operators[row_index];

        if (checkRow()) {
          row_index -= 1;
        }

        function checkRow() {
          for (let col_index = 0; col_index < row.length - 1; col_index++) {
            const col = row[col_index];

            const isUnary = t.isUnaryExpression(col, { operator: '!' });
            const isBinary = t.isBinaryExpression(col, { operator: '!==' });
            if (!isUnary && !isBinary) continue;

            for (let row2_index = 0; row2_index < operators.length; row2_index++) {
              const row2 = operators[row2_index];
              for (let col2_index = 0; col2_index < row2.length - 1; col2_index++) {
                const col2 = row2[col2_index];
                if (row_index === row2_index && col_index === col2_index) continue;

                if (isUnary && !helpers.compareNodes(col.argument, col2)) {
                  continue;
                } else if (
                  isBinary &&
                  !(
                    t.isBinaryExpression(col2, { operator: '===' }) &&
                    ((helpers.compareNodes(col.left, col2.left) &&
                      helpers.compareNodes(col.right, col2.right)) ||
                      (helpers.compareNodes(col.left, col2.right) &&
                        helpers.compareNodes(col.right, col2.left)))
                  )
                ) {
                  continue;
                }

                const left = helpers.createLogicalAndExpression(
                  row2.filter((e, index) => index !== col2_index),
                );
                const right = helpers.createLogicalAndExpression(
                  row.filter((e, index) => index !== col_index),
                );

                // isUnary: col2 is 1 char shorter (col2: foo vs col: !foo)
                // isBinary: col2 has the === operator
                result.push(t.conditionalExpression(col2, left, right));

                // Remove from collection
                operators = operators.filter(
                  (e, index) => index !== row_index && index !== row2_index,
                );
                return true;
              }
            }
          }
          return false;
        }
      }

      return [...result, ...operators.map(helpers.createLogicalAndExpression)];
    }
  },
};

export default (path, options) => {
  path.traverse(visitor, { options });
};
