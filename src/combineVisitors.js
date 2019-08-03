import _ from 'lodash';
import * as t from '@babel/types';

/**
 * Combines consecutive visitor objects to improve performance by reducing overhead.
 * @warning `CallExpression` is filtered and only called for methods listed in `functionNames`.
 * @param rawVisitors An array of functions and/or visitor objects
 */
export default function combineVisitors(rawVisitors) {
  const processedVisitors = [];
  let tempVisitorHolder = [];

  // Combine consecutive visitor objects into an array
  for (const visitor of rawVisitors) {
    if (typeof visitor === 'object') {
      tempVisitorHolder.push(visitor);
      continue;
    }

    if (tempVisitorHolder.length) {
      processedVisitors.push(tempVisitorHolder);
      tempVisitorHolder = [];
    }
    processedVisitors.push(visitor);
  }

  if (tempVisitorHolder.length) {
    // The last item in visitors was an object
    processedVisitors.push(tempVisitorHolder);
  }

  return processedVisitors.map(visitor => {
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
    let mainVisitor = {};

    for (const obj of visitor) {
      _.forOwn(obj, (value, key) => {
        // Add the visitor to the lookup so it can be called from the mainVisitor
        if (visitorLookup[key] === undefined) {
          visitorLookup[key] = [];
        }
        visitorLookup[key].push(value);

        if (mainVisitor[key] !== undefined) {
          return;
        }

        // Create the visitor that will be called by babel
        mainVisitor = {
          ...mainVisitor,
          [key](path, ...args) {
            // Skip CallExpression visitors if it isn't clsx, classnames, etc.
            if (key === 'CallExpression') {
              const c = path.node.callee;
              if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
                return;
              }
            }

            for (const x of visitorLookup[key]) {
              x.call(this, path, ...args);
              if (path.shouldSkip) {
                // If the visitor calls path.skip, skip all other visitors in the group
                return;
              }
            }
          },
        };
      });
    }

    return (path, options) => {
      path.traverse(mainVisitor, { options });
    };
  });
}
