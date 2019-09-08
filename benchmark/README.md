# Benchmarks

To run the benchmarks yourself use `yarn benchmark`

Case one and two are extracted from https://github.com/mui-org/material-ui

|            |        |
| ---------- | ------ |
| Node       | 12.9.0 |
| clsx       | 1.0.4  |
| classnames | 2.2.6  |

# Results

`N/A` means the function call was optimized away and no library was used

```
# case_1.js - Extract properties, combine arguments, and conditional expression:
  before - classnames x 455,076 ops/sec ±0.29% (89 runs sampled)
  before -    clsx    x 515,270 ops/sec ±0.24% (93 runs sampled)
  after  - classnames x 2,147,313 ops/sec ±0.29% (94 runs sampled)
  after  -    clsx    x 7,170,564 ops/sec ±0.66% (89 runs sampled)

# case_2.js - Extract properties and combine arguments:
  before - classnames x 270,775 ops/sec ±0.48% (93 runs sampled)
  before -    clsx    x 288,193 ops/sec ±0.25% (93 runs sampled)
  after  - classnames x 1,644,390 ops/sec ±0.39% (94 runs sampled)
  after  -    clsx    x 4,097,308 ops/sec ±0.63% (93 runs sampled)

# case_3.js - Object with string literals:
  before - classnames x 3,579,582 ops/sec ±0.38% (91 runs sampled)
  before -    clsx    x 7,029,547 ops/sec ±0.58% (89 runs sampled)
  after  -    N/A     x 851,510,031 ops/sec ±0.26% (92 runs sampled)

# case_4.js - Unnecessary function calls:
  before - classnames x 4,771,703 ops/sec ±0.40% (92 runs sampled)
  before -    clsx    x 8,444,230 ops/sec ±0.32% (89 runs sampled)
  after  -    N/A     x 842,537,779 ops/sec ±0.26% (89 runs sampled)
```
