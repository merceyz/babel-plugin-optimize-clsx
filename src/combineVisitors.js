import _ from 'lodash';
import * as t from '@babel/types';

/**
 * Combines consecutive visitor objects to improve performance by reducing overhead.
 * @warning `CallExpression` is filtered and only called for methods listed in `functionNames`.
 * @param visitors An array of functions and/or visitor objects
 */
export default function combineVisitors(visitors) {
  return (
    visitors
      // Combine consecutive visitor objects into an array
      .reduce((accumulator, visitor) => {
        if (typeof visitor === 'object') {
          if (accumulator.length && Array.isArray(accumulator[accumulator.length - 1])) {
            accumulator[accumulator.length - 1].push(visitor);
          } else {
            accumulator.push([visitor]);
          }
        } else {
          accumulator.push(visitor);
        }
        return accumulator;
      }, [])
      // Convert arrays of consecutive visitor objects to a single visitor object that calls
      // all visitors in the array
      .map(visitor => {
        if (!Array.isArray(visitor)) {
          return visitor;
        }

        /**
         * { CallExpression: [visitor1, visitor2, ...], ...}
         */
        const visitorLookup = {};
        /**
         * {
         * CallExpression(...args) {
         *  visitorLookup[CallExpression].forEach(x => x.call(this, ...args))
         * }
         */
        let combinedVisitors = {};

        for (const obj of visitor) {
          _.forOwn(obj, (value, key) => {
            // Add the visitor to the lookup so it can be called from the mainVisitor
            if (visitorLookup[key] === undefined) {
              visitorLookup[key] = [];
            }
            visitorLookup[key].push(value);

            if (combinedVisitors[key] !== undefined) {
              return;
            }

            // Create the visitor that will be called by babel
            combinedVisitors = {
              ...combinedVisitors,
              [key](path, ...args) {
                let functionName = null;
                // Skip CallExpression visitors if it isn't clsx, classnames, etc.
                if (key === 'CallExpression') {
                  const c = path.node.callee;
                  if (t.isIdentifier(c) && this.options.functionNames.includes(c.name)) {
                    functionName = c.name;
                  } else {
                    return;
                  }
                }

                for (const x of visitorLookup[key]) {
                  x.call(this, path, ...args);
                  // If the visitor calls path.skip, path.remove, or the type changes (path.replace*)
                  // then skip all other visitors in the group
                  if (path.shouldSkip || path.type !== key) {
                    // If the function was a match in options.functionNames and the type changed,
                    // decrement the counter so that the import can be removed without crawling the AST
                    if (
                      functionName !== null &&
                      key === 'CallExpression' &&
                      path.type !== 'CallExpression' &&
                      this.functionCounters !== undefined &&
                      this.functionCounters[functionName]
                    ) {
                      this.functionCounters[functionName] -= 1;
                    }
                    return;
                  }
                }
              },
            };
          });
        }

        return (path, options) => {
          path.traverse(combinedVisitors, {
            options,
            functionCounters: path.functionCounters,
          });
        };
      })
  );
}
