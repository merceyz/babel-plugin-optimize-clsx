import * as t from '@babel/types';
import generate from '@babel/generator';
import fs from 'fs';
import osPath from 'path';

let stream = null;
let count = 0;

const visitor = {
  CallExpression(path) {
    const c = path.node.callee;
    if (!t.isIdentifier(c) || !this.options.functionNames.includes(c.name)) {
      return;
    }

    stream.write(`const x${++count} = ${generate(path.node).code};\n\n`);
  },
};

export default (path, options) => {
  if (!options.collectCalls) {
    return;
  }

  if (stream === null) {
    const filePath = osPath.join(__dirname, 'log.js');
    stream = fs.createWriteStream(filePath, { flags: 'w' });
    console.log('Writing calls to ' + filePath);
  }

  path.traverse(visitor, { options });
};
