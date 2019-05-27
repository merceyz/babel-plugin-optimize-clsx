import * as t from '@babel/types';

export default (path, options) => {
  if (
    options.libraries.length === 0 ||
    (options._removeUnusedImports && !options.removeUnnecessaryCalls)
  ) {
    return;
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
      addOrRemoveNode(nodePath, item.specifiers[0].local.name);
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
          addOrRemoveNode(decPath, dec.id.name);
        }
      });
    }

    function addOrRemoveNode(itemPath, name) {
      if (!options._removeUnusedImports) {
        options.functionNames.push(name);
        return;
      }

      // Need to refresh references
      itemPath.scope.crawl();
      if (!itemPath.scope.getBinding(name).referenced) {
        itemPath.remove();
      }
    }
  });
};
