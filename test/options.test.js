import * as babel from '@babel/core';
import path from 'path';

const generateTestCase = name => [`${name}('class',{a:bool});`, `${name}('class',bool&&a);`];

const cases = [generateTestCase('cns'), generateTestCase('lol')];

it('should NOT change code w/ out defaults option', () => {
  cases.forEach(([pre, post]) => {
    const result = babel.transformSync(pre, {
      plugins: [path.resolve(__dirname, '..')],
      babelrc: false,
      configFile: false,
      compact: true,
    });

    expect(result.code).toBe(pre);
  });
});

it('should change code w/ out defaults option', () => {
  cases.forEach(([pre, post]) => {
    const result = babel.transformSync(pre, {
      plugins: [[path.resolve(__dirname, '..'), { defaultNames: ['cns', 'lol'] }]],
      babelrc: false,
      configFile: false,
      compact: true,
    });

    expect(result.code).toBe(post);
  });
});
