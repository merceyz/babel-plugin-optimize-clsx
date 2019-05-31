# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.2.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.1.0...v2.2.0) (2019-05-31)

### Features

- **createlookup:** handle multiple checks ([950dd82](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/950dd82))
- create object key lookups ([0630c91](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/0630c91))
- **combinestrings:** handle strings in arrays ([62c4ce9](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/62c4ce9))
- **removecalls:** handle nested conditional expressions ([2110589](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/2110589))
- **removecalls:** handle single logical expression ([0c453b3](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/0c453b3))
- **removecalls:** handle string and logical expression as argument ([2b59da8](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/2b59da8))

### Tests

- remove retainLines ([07dcd92](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/07dcd92))
- test:dev should ignore output ([eea4081](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/eea4081))

## [2.1.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.0.0...v2.1.0) (2019-05-27)

### Bug Fixes

- **proptypes:** handle isRequired and default value ([aa244e3](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/aa244e3))

### Build System

- use rollup, babel, and terser ([29e730f](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/29e730f))

### Features

- combine string literals ([0bc7671](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/0bc7671))
- remove unnecessary function calls ([3ea3d85](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/3ea3d85))
- remove unused imports ([8d2ae5f](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/8d2ae5f))
- strip literals ([f206424](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/f206424))
- use proptypes to minimize expressions ([300b006](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/300b006))

# [2.0.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v1.1.2...v2.0.0) (2019-05-21)

### Bug Fixes

- **combine:** don't create an arrayExpression with just one item ([699d6f5](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/699d6f5))
- **extract:** transform static keys into string literals ([#2](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/2)) ([213ff5b](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/213ff5b))
- **helper:** use count instead of total length ([5ffec80](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/5ffec80))

### Features

- add support for creating conditional expressions ([dab4b1a](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/dab4b1a))
- get function name from imports ([#1](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/1)) ([0c18712](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/0c18712))

### Performance Improvements

- **combine:** skip if argument length is less than 2 ([2bc0714](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/2bc0714))

### BREAKING CHANGES

- No longer matches on all `clsx` and `classnames` function calls, instead looks for imports(and require) and uses the names specified there. If the file doesn't contain imports nothing will be done, to get the old behaviour back you can set the `functionNames` option to `['clsx', 'classnames']`

## [1.1.2](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v1.1.1...v1.1.2) (2019-05-07)

### Bug Fixes

- **combine:** don't compare node against itself ([9b990f6](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/9b990f6))

## [1.1.1](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v1.1.0...v1.1.1) (2019-05-07)

### Bug Fixes

- **combine:** don't assume jagged array has dimension [x][1] ([3b308a1](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/3b308a1))
- **combine:** skip if no node appears more than once ([f888818](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/f888818))
- use lodash to compare nodes ([b10733e](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/b10733e))

# [1.1.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v1.0.1...v1.1.0) (2019-05-05)

### Bug Fixes

- babel/types should not be a devDependency ([36107ce](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/36107ce))

### Features

- add support for classNames ([f8de735](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/f8de735))
- add support for combining arguments ([5708852](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/5708852))
- handle exceptions correctly ([7a5c96c](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/7a5c96c))

## [1.0.1](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v1.0.0...v1.0.1) (2019-05-04)

# 1.0.0 (2019-05-04)

### Features

- add support for optimizing objects ([299d0b9](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/299d0b9))
