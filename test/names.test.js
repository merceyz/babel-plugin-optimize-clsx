import * as babel from '@babel/core';
import path from 'path';

const dataPairs = [
  ['classnames', 'classNames'],
  ['classnames', 'cn'],
  ['classnames', 'classnames'],
  ['clsx', 'clsx'],
  ['clsx', 'cn'],
];

const generateImportCase = (libName, importAs) => [
  `import ${importAs} from'${libName}';${importAs}('class', {a: bool})`,
  `import ${importAs} from'${libName}';${importAs}('class',bool&&a);`,
];

const importTestCases = dataPairs.map(p => generateImportCase(...p));

const generateRequireCase = (libName, importAs) => [
  `const ${importAs} = require('${libName}');${importAs}('class', {a: bool})`,
  `const ${importAs}=require('${libName}');${importAs}('class',bool&&a);`,
];

const requireTestCases = dataPairs.map(p => generateImportCase(...p));

it('transforms calls regardless of imported name', () => {
  importTestCases.forEach(([pre, post]) => {
    const result = babel.transformSync(pre, {
      plugins: [path.resolve(__dirname, '..')],
      babelrc: false,
      configFile: false,
      compact: true,
    });

    expect(result.code).toBe(post);
  });
});

it('transforms calls regardless of required name', () => {
  requireTestCases.forEach(([pre, post]) => {
    const result = babel.transformSync(pre, {
      plugins: [path.resolve(__dirname, '..')],
      babelrc: false,
      configFile: false,
      compact: true,
    });

    expect(result.code).toBe(post);
  });
});
