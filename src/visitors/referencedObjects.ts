import * as t from '@babel/types';
import { VisitorFunction } from '../types';

export const referencedObjects: VisitorFunction = ({ expression, pushToQueue }) => {
  const args = expression.get('arguments');

  for (const nodePath of args) {
    if (!nodePath.isIdentifier()) {
      continue;
    }

    const binding = nodePath.scope.getBinding(nodePath.node.name);
    if (!binding) {
      continue;
    }

    if (
      binding.constant &&
      binding.path.isVariableDeclarator() &&
      t.isObjectExpression(binding.path.node.init) &&
      binding.referencePaths.every(
        ref =>
          ref.parentPath.isCallExpression() && ref.parentPath.getData('is_optimizable') === true,
      )
    ) {
      const init = binding.path.get('init');

      init.replaceWith(t.callExpression(expression.node.callee, [binding.path.node.init]));
      pushToQueue(init as babel.NodePath<t.CallExpression>);
    }
  }
};
