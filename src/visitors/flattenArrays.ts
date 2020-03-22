import * as t from '@babel/types';
import _ from 'lodash';
import { VisitorFunction } from '../types';

function unwrapArrayExpression(nodes: any[]): any[] {
	return nodes.map((item) =>
		t.isArrayExpression(item) ? unwrapArrayExpression(item.elements) : item
	);
}

export const flattenArrays: VisitorFunction = ({ expression }) => {
	expression.node.arguments = _.flattenDeep(unwrapArrayExpression(expression.node.arguments));
};
