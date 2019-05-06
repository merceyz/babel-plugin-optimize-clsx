# babel-plugin-optimize-clsx

Babel plugin to optimize `clsx` and `classNames` function calls

## Install

```
yarn add babel-plugin-optimize-clsx --dev
or
npm install babel-plugin-optimize-clsx --save-dev
```

## Example

### Extract objects

Transforms

```javascript
clsx(
  'foo',
  {
    [classes.disabled]: disabled,
    [classes.focusVisible]: focusVisible && !disabled,
  },
  'bar',
);
```

to

```javascript
clsx('foo', disabled && classes.disabled, focusVisible && !disabled && classes.focusVisible, 'bar');
```

### Extract and combine

Transforms

```javascript
clsx({
  [classes.disabled]: disabled,
  [classes.focusVisible]: this.state.focusVisible,
  [focusVisibleClassName]: this.state.focusVisible,
});
```

to

```javascript
clsx(
  this.state.focusVisible && [classes.focusVisible, focusVisibleClassName],
  disabled && classes.disabled,
);
```

## Benchmarks

Benchmarks can be found in the [`benchmark`](/benchmark) directory
