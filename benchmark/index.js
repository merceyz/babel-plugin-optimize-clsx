const Benchmark = require('benchmark');
const path = require('path');
const fs = require('fs');

function bench(name, description, before, after) {
  console.log(`# ${name} - ${description}:`);
  new Benchmark.Suite()
    .add('before', before)
    .add('after ', after)
    .on('cycle', e => console.log('  ' + e.target))
    .run();
  console.log('');
}

const dir = path.join(__dirname, 'cases');
fs.readdir(dir, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach(f => {
    const c = require(path.join(dir, f));

    bench(f, ...c);
  });
});
