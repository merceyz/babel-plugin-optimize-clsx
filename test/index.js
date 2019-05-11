import pluginTester from 'babel-plugin-tester';
import optimizeClsx from '../src/index';
import path from 'path';
import fs from 'fs';
import prettier from 'prettier';

const prettierConfig = prettier.resolveConfig.sync(path.join(__dirname, '../.prettierrc'));
prettierConfig.parser = 'babel';

function format(code) {
  // babel-plugin-tester calls trim when it reads the output file
  // so we have to trim off whitespace as well
  return prettier.format(code, prettierConfig).trim();
}

const options = {
  pluginName: 'optimize-clsx',
  plugin: optimizeClsx,
  babelOptions: {
    babelrc: false,
    configFile: false,
    retainLines: true,
    compact: false,
  },
  formatResult: format,
  fixtures: path.join(__dirname, 'fixtures'),
};

if (process.env.DEV_MODE) {
  const devDir = path.join(__dirname, 'dev_fixture');
  if (fs.existsSync(devDir) === false) {
    // Setup a default test to make it easier to start debugging
    const defaultFixture = path.join(devDir, 'default');
    fs.mkdirSync(devDir);
    fs.mkdirSync(defaultFixture);
    fs.writeFileSync(path.join(defaultFixture, 'code.js'), 'clsx(foo && bar);');
    process.exit(0);
  }

  pluginTester({
    ...options,
    fixtures: devDir,
  });
} else {
  pluginTester(options);
}
