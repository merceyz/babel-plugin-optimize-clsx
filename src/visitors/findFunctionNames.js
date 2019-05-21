const t = require('@babel/types');

module.exports = (path, options) => {
  const node = path.node;

  if (!t.isProgram(node)) {
    throw new Error('Node has to be a program node');
  }

  if (options.libraries.length === 0) {
    return;
  }

  node.body.forEach(item => {
    // import x from 'y';
    if (t.isImportDeclaration(item)) {
      if (
        options.libraries.includes(item.source.value) &&
        item.specifiers.length === 1 &&
        t.isImportDefaultSpecifier(item.specifiers[0])
      ) {
        options.functionNames.push(item.specifiers[0].local.name);
      }
    }
    // const x = require('y');
    else if (t.isVariableDeclaration(item)) {
      item.declarations.forEach(dec => {
        if (
          t.isVariableDeclarator(dec) &&
          t.isCallExpression(dec.init) &&
          t.isIdentifier(dec.init.callee, { name: 'require' }) &&
          dec.init.arguments.length === 1 &&
          t.isLiteral(dec.init.arguments[0]) &&
          options.libraries.includes(dec.init.arguments[0].value)
        ) {
          options.functionNames.push(dec.id.name);
        }
      });
    }
  });
};
