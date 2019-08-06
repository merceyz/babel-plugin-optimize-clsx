import * as t from '@babel/types';
import _ from 'lodash';

export default (path, options) => {
  if (
    options.libraries.length === 0 ||
    (options._removeUnusedImports && !options.removeUnnecessaryCalls)
  ) {
    return;
  }

  if (options._removeUnusedImports && options.removeUnnecessaryCalls) {
    _.forOwn(path.functionCounters, (value, key) => {
      if (value === 0) {
        path.importPaths[key].remove();
      }
    });
    return;
  }

  function addNameToState(itemPath, name) {
    options.functionNames.push(name);

    path.functionCounters = {
      ...(path.functionCounters || {}),
      [name]: itemPath.scope.getBinding(name).references,
    };

    path.importPaths = {
      ...(path.importPaths || {}),
      [name]: itemPath,
    };
  }

  path.get('body').forEach(nodePath => {
    const item = nodePath.node;

    // import x from 'y';
    if (
      t.isImportDeclaration(item) &&
      options.libraries.includes(item.source.value) &&
      item.specifiers.length === 1 &&
      t.isImportDefaultSpecifier(item.specifiers[0])
    ) {
      addNameToState(nodePath, item.specifiers[0].local.name);
    }
    // const x = require('y');
    else if (t.isVariableDeclaration(item)) {
      nodePath.get('declarations').forEach(decPath => {
        const dec = decPath.node;
        if (
          t.isVariableDeclarator(dec) &&
          t.isCallExpression(dec.init) &&
          t.isIdentifier(dec.init.callee, { name: 'require' }) &&
          dec.init.arguments.length === 1 &&
          t.isLiteral(dec.init.arguments[0]) &&
          options.libraries.includes(dec.init.arguments[0].value)
        ) {
          addNameToState(decPath, dec.id.name);
        }
      });
    }
  });
};
