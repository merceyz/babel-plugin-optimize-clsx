import * as babel from '@babel/core';
import path from 'path';

const generateCase = (libName, importAs) => [
  `import ${importAs} from'${libName}';${importAs}('class', {a: bool})`,
  `import ${importAs} from'${libName}';${importAs}('class',bool&&a);`,
];

const testCases = [
  generateCase('classnames', 'classNames'),
  generateCase('classnames', 'cn'),
  generateCase('classnames', 'classnames'),
  generateCase('clsx', 'clsx'),
  generateCase('clsx', 'cn'),
];

it('transforms calls regardless of imported name', () => {
  testCases.forEach(([pre, post]) => {
    const result = babel.transformSync(pre, {
      plugins: [path.resolve(__dirname, '..')],
      babelrc: false,
      configFile: false,
      compact: true,
    });

    expect(result.code).toBe(post);
  });
});
