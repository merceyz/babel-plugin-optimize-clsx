import * as babel from '@babel/core';
import * as t from '@babel/types';
import { PluginOptions } from './options';

type ImportMap = {
  source: babel.NodePath;
  referenceCount: number;
  expressions: Array<babel.NodePath<t.CallExpression>>;
};

type FindFunctionsResult = Array<babel.NodePath<t.CallExpression> | ImportMap>;

const getFunctions: babel.Visitor<{ options: PluginOptions; functions: FindFunctionsResult }> = {
  CallExpression(path) {
    const { callee } = path.node;
    if (t.isIdentifier(callee) && this.options.functionNames.includes(callee.name)) {
      path.setData('is_optimizable', true);
      this.functions.push(path);
    }
  },
};

export function isImportMap(node: any): node is ImportMap {
  return node.referenceCount !== undefined;
}

export function findExpressions(program: babel.NodePath<t.Program>, options: PluginOptions) {
  const result: FindFunctionsResult = [];

  if (options.functionNames.length) {
    program.traverse(getFunctions, { options, functions: result });
  }

  if (!options.libraries.length) {
    return result;
  }

  const addToState = (path: babel.NodePath, name: string) => {
    const binding = path.scope.getBinding(name);
    if (!binding) {
      return;
    }

    const expressions: babel.NodePath<t.CallExpression>[] = [];

    const refPaths = binding.referencePaths;
    for (const ref of refPaths) {
      const call = ref.parentPath;
      if (call.isCallExpression()) {
        call.setData('is_optimizable', true);
        expressions.push(call);
      }
    }

    if (expressions.length) {
      result.push({
        source: path,
        referenceCount: binding.references,
        expressions,
      });
    }
  };

  const body = program.get('body');
  for (const statement of body) {
    // import x from 'y';
    // import * as x from 'y';
    if (
      statement.isImportDeclaration() &&
      options.libraries.includes(statement.node.source.value) &&
      statement.node.specifiers.length === 1 &&
      (t.isImportDefaultSpecifier(statement.node.specifiers[0]) ||
        t.isImportNamespaceSpecifier(statement.node.specifiers[0]))
    ) {
      addToState(statement, statement.node.specifiers[0].local.name);
    }
    // const x = require('y');
    else if (statement.isVariableDeclaration()) {
      statement.get('declarations').forEach(decPath => {
        const dec = decPath.node;
        if (
          t.isIdentifier(dec.id) &&
          t.isCallExpression(dec.init) &&
          t.isIdentifier(dec.init.callee, { name: 'require' }) &&
          dec.init.arguments.length === 1 &&
          t.isStringLiteral(dec.init.arguments[0]) &&
          options.libraries.includes(dec.init.arguments[0].value)
        ) {
          addToState(decPath, dec.id.name);
        }
      });
    }
  }

  return result;
}
