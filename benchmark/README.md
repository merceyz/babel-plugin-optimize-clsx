# Benchmarks

Below are the benchmark results for `Node v11.14.0` and `clsx v1.0.4`.

To test these benchmarks yourself run `yarn benchmark`

Some of the cases are code extracted from https://github.com/mui-org/material-ui

# Results

```
# case_1.js - Extract properties, combine arguments, and conditional expression:
  before x 725,714 ops/sec ±0.41% (92 runs sampled)
  after  x 7,403,876 ops/sec ±0.33% (92 runs sampled)

# case_2.js - Extract properties and combine arguments:
  before x 402,253 ops/sec ±0.32% (92 runs sampled)
  after  x 4,443,619 ops/sec ±1.53% (91 runs sampled)

# case_3.js - String literals:
  before x 7,271,738 ops/sec ±0.96% (92 runs sampled)
  after  x 850,938,371 ops/sec ±0.25% (93 runs sampled)

# case_4.js - Unnecessary function calls:
  before x 8,372,334 ops/sec ±0.49% (90 runs sampled)
  after  x 853,523,303 ops/sec ±0.23% (92 runs sampled)
```
