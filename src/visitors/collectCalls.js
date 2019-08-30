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
      const filePath = osPath.join(
        __dirname,
        `log-${new Date(Date.now()).toISOString().replace(/:/g, '.')}.js`,
      );
      stream = fs.createWriteStream(filePath, { flags: 'w' });
      console.log('Writing calls to ' + filePath);
    }

    const location = path.node.loc.start;
    stream.write(
      `// ${this.state.filename}:${location.line}:${location.column}\nconst x${++count} = ${
        generate(path.node).code
      };\n\n`,
    );
  },
};
