# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.6.2](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.6.1...v2.6.2) (2021-06-18)

### Bug Fixes

- clone callee when wrapping referenced objects ([16eef18](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/16eef18a0f181989920ad1e05fc0b7ba42b6bc54)), closes [#20](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/20)

### [2.6.1](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.6.0...v2.6.1) (2020-06-20)

### Bug Fixes

- remove peerDependency on babel/core ([744391d](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/744391dabca970d16ce652869a4b740fbbb1a158))
- **collectCalls:** write CallExpressions to the cache dir ([17405f5](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/17405f54b1ea03ccf2b8d6f556804b9dc04dfe12))
- **createlookup:** handle optional member expression ([1af84b2](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/1af84b239fc3cbad12ccf822c33679d2a0ff3162))

### Build System

- disable sourcemap ([59b8b9e](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/59b8b9ee976919d5a5bb0cfce4796bbdcd5562a6))

## [2.6.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.5.0...v2.6.0) (2020-02-15)

### Features

- **referenced-objects:** handle multiple references ([14a2e97](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/14a2e97eb97c713b118c7cf3a2ee5017f5050f26))
- optimize referenced objects ([20575e9](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/20575e9675e0e0381cee2d9205b7486e217f20ba))
- **optimize:** handle unnecessary "or" statements ([fcdb75e](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/fcdb75e6b229d663d493bc00fa605bf1031be855))
- use scope to get expressions ([68becac](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/68becacd5776a112a920f0ce32fd0accb2fb774d))

### Bug Fixes

- **optimize:** handle the operator changing ([3e92ddb](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/3e92ddb2aa629dd7a6e018368e016cca2e663e44))
- **removecalls:** remove unsafe optimization ([b0deb61](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/b0deb61a0da8ed63e561b4a1999ddedc4f2d9c3a))

### Performance Improvements

- **createlookup:** modify node instead of recreating it ([4800a6b](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/4800a6b1cd6668e2450feea9812c78b4f37cb85e))
- **createlookup:** skip lookup for just one item ([f8d089d](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/f8d089ddfbf67ac451fd720c1dfc3a41b7528f28))

### Build System

- include a esm version ([8a590ef](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/8a590efc398a65a4f3ae3d7e88a3ba3ddd4ac1cb))
- remove terser ([dceb1e8](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/dceb1e8af92fb83144b6772cce6fa32730a392bb))

## [2.5.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.4.1...v2.5.0) (2019-10-07)

### Bug Fixes

- **combinestrings:** set cooked value for templateelement ([5e25580](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/5e25580)), closes [#15](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/15)
- **extract:** handle spread and method properties ([51c8ced](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/51c8ced))
- **optimize:** handle ConditionalExpression in LogicalExpression ([fa05e72](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/fa05e72))

### Build System

- **deps:** upgrade dependencies ([cd02789](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/cd02789))
- improve terser output ([11ca28b](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/11ca28b))
- remove rollup-plugin-commonjs ([b994f88](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/b994f88))

### Features

- **collectcalls:** include the location of the code ([1ab1eab](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/1ab1eab))

### [2.4.1](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.4.0...v2.4.1) (2019-08-18)

### Build System

- **babel:** target node 8 ([a888c69](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/a888c69))

## [2.4.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.3.0...v2.4.0) (2019-08-18)

### Bug Fixes

- **helper:** compare literals correctly ([d728a45](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/d728a45))
- **stripliterals:** handle all falsy values ([721af56](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/721af56))
- **stripliterals:** handle empty template literals ([1e9295c](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/1e9295c))
- **stripliterals:** remove more unnecessary truthy values ([98d2a9d](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/98d2a9d))

### Build System

- **deps:** add babel-plugin-lodash ([cd37d10](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/cd37d10))
- **deps-dev:** bump husky from 3.0.0 to 3.0.2 ([#3](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/3)) ([de0ff50](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/de0ff50))
- **deps-dev:** bump rollup from 1.17.0 to 1.19.4 ([#12](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/12)) ([0cb7b7e](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/0cb7b7e))
- **deps-dev:** bump standard-version from 6.0.1 to 7.0.0 ([#6](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/6)) ([e699d1d](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/e699d1d))

### Features

- flatten and remove arrays ([5ca8e7a](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/5ca8e7a))
- optimize expressions ([236071e](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/236071e))
- support namespace imports ([d6c5597](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/d6c5597))

### Performance Improvements

- **helper:** avoid unnecessary compares ([a5f1312](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/a5f1312))
- **helper:** compare type of nodes directly ([41ff13f](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/41ff13f))
- **helper:** use switch statement over if else chain ([b2874ad](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/b2874ad))
- track removed calls to avoid crawling the AST ([28188a8](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/28188a8))
- **proptypes:** skip traversing child nodes ([ec883af](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/ec883af))
- combine visitors ([#8](https://github.com/merceyz/babel-plugin-optimize-clsx/issues/8)) ([d6a9a62](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/d6a9a62))

## [2.3.0](https://github.com/merceyz/babel-plugin-optimize-clsx/compare/v2.2.0...v2.3.0) (2019-07-18)

### Bug Fixes

- handle template and string literals correctly ([f90ddaf](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/f90ddaf))

### Build System

- rimraf dist before each build ([d3f9f1f](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/d3f9f1f))

### Features

- **removecalls:** handle arrays ([524fa51](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/524fa51))
- **stripliterals:** handle conditionalExpressions ([18e35ba](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/18e35ba))
- collect calls before optimizing ([c2537e5](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/c2537e5))
- **combinestrings:** support template literals ([3d63596](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/3d63596))
- **removecalls:** handle template literal ([7ccf15f](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/7ccf15f))
- **stripliterals:** remove empty strings ([8672550](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/8672550))

### Tests

- **stripliterals:** improve coverage ([8b5c717](https://github.com/merceyz/babel-plugin-optimize-clsx/commit/8b5c717))

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
