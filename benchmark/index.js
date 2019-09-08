const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');
const clsx = require('clsx');
const classnames = require('classnames');

function bench(name, { title, before, after }) {
  console.log(`\n# ${name} - ${title}:`);

  const suite = new Benchmark.Suite();

  suite.add('before - classnames', () => before(classnames));
  suite.add('before -    clsx   ', () => before(clsx));

  // If the argument length is 0 then the function call has been optimized away
  if (after.length === 0) {
    suite.add('after  -    N/A    ', after);
  } else {
    suite.add('after  - classnames', () => after(classnames));
    suite.add('after  -    clsx   ', () => after(clsx));
  }

  suite.on('cycle', e => console.log('  ' + e.target));
  suite.run();
}

const dir = path.join(__dirname, 'cases');
fs.readdir(dir, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach(f => {
    const testCase = require(path.join(dir, f));

    bench(f, testCase);
  });
  console.log();
});
