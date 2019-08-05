import generate from '@babel/generator';
import fs from 'fs';
import osPath from 'path';

let stream = null;
let count = 0;

export default {
  CallExpression(path) {
    if (!this.options.collectCalls) {
      return;
    }

    if (stream === null) {
      const filePath = osPath.join(__dirname, 'log.js');
      stream = fs.createWriteStream(filePath, { flags: 'w' });
      console.log('Writing calls to ' + filePath);
    }

    stream.write(`const x${++count} = ${generate(path.node).code};\n\n`);
  },
};
