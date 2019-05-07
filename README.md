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

## Options

| Name           | Type                 | Required | Default | Description                                                                                                                                                                                                                                                           |
| -------------- | -------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultNames` | `array` of `strings` | no       | `[]`    | By default the plugin looks up if you `import` or `require` `classnames` or `clsx` within a file. If you prefer to re-export them you can provide an array of strings where a string is your name convention which should be transformed to a more performant syntax. |

## Benchmarks

Benchmarks can be found in the [`benchmark`](/benchmark) directory
