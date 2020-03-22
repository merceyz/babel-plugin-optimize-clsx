import * as t from '@babel/types';
import * as babel from '@babel/core';
import * as helpers from '../utils/helpers';
import _ from 'lodash/fp';
import { VisitorFunction } from '../types';

type ExtractPathType<P> = P extends babel.NodePath<infer T> ? T : never;

type VisitorWithoutPath = {
	// @ts-ignore - Works perfectly fine
	[P in keyof babel.Visitor]: (node: ExtractPathType<Parameters<babel.Visitor[P]>[0]>) => any;
};

const optimizations: VisitorWithoutPath = {
	ConditionalExpression(node) {
		// foo ? bar : '' --> foo && bar
		if (helpers.isNodeFalsy(node.alternate)) {
			return t.logicalExpression('&&', node.test, node.consequent);
		}

		// foo ? '' : bar --> !foo && bar
		if (helpers.isNodeFalsy(node.consequent)) {
			return t.logicalExpression('&&', t.unaryExpression('!', node.test), node.alternate);
		}
	},
	BinaryExpression(node) {
		// This transform allows createConditionalExpression to optimize the expression later
		// foo % 2 === 1 --> foo % 2 !== 0
		// foo % 2 !== 1 --> foo % 2 === 0
		if (
			(node.operator === '!==' || node.operator === '===') &&
			t.isNumericLiteral(node.right, { value: 1 }) &&
			t.isBinaryExpression(node.left, { operator: '%' }) &&
			t.isNumericLiteral(node.left.right, { value: 2 })
		) {
			return {
				...node,
				right: t.numericLiteral(0),
				operator: node.operator === '===' ? '!==' : '===',
			};
		}
	},
	LogicalExpression(node) {
		// foo || '' -> foo
		if (node.operator === '||' && helpers.isNodeFalsy(node.right)) {
			return node.left;
		}

		if (helpers.isNestedLogicalAndExpression(node)) {
			return _.flow(
				helpers.flattenLogicalExpression,
				// Remove duplicates in the same expression
				// foo && bar && bar --> foo && bar
				_.uniqBy(helpers.hashNode),
				// Optimize individual expressions
				_.map(optimizeExpression),
				helpers.createLogicalAndExpression
			)(node);
		}
	},
};

function optimizeExpression(node: t.Node): any {
	if (node.type in optimizations) {
		// @ts-ignore
		const result = optimizations[node.type](node);
		if (result) {
			// @ts-ignore
			return result.type !== node.type || result.operator !== node.operator
				? optimizeExpression(result)
				: result;
		}
	}

	return node;
}

export const optimizeExpressions: VisitorFunction = ({ expression }) => {
	expression.node.arguments = expression.node.arguments.map(optimizeExpression);
};
