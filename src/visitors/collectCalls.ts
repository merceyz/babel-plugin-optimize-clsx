import generate from '@babel/generator';
import findCacheDir from 'find-cache-dir';
import fs from 'fs';
import path from 'path';
import { VisitorFunction } from '../types';

let stream: fs.WriteStream | null = null;
let count = 0;

export const collectCalls: VisitorFunction = ({ expression, options, filename }) => {
	if (!options.collectCalls) {
		return;
	}

	if (stream === null) {
		const cacheDir = findCacheDir({ name: 'optimize-clsx', create: true });
		if (!cacheDir) {
			throw new Error('Unable to locate cache directory');
		}

		const filePath = path.join(
			cacheDir,
			`log-${new Date(Date.now()).toISOString().replace(/:/g, '.')}.js`
		);
		stream = fs.createWriteStream(filePath, { flags: 'w' });
		console.log('Writing CallExpressions to ' + filePath);
	}

	let locationStr = '';
	if (expression.node.loc) {
		const location = expression.node.loc.start;
		locationStr = `:${location.line}:${location.column}`;
	}

	stream.write(
		`// ${filename}${locationStr}\nconst x${++count} = ${generate(expression.node).code};\n\n`
	);
};
