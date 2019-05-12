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

## Options

| Name        | Type       | Default value            |
| ----------- | ---------- | ------------------------ |
| `libraries` | `string[]` | `['clsx', 'classnames']` |

By default the plugin looks for `import` and `require` statements for `clsx` and `classnames` and uses that to know which function calls to optimize. If you're using another library with the same API you can overwrite this option.

```json
{
  "plugins": [
    [
      "babel-plugin-optimize-clsx",
      {
        "libraries": ["clsx", "classnames", "my-custom-library"]
      }
    ]
  ]
}
```

---

| Name            | Type       | Default value |
| --------------- | ---------- | ------------- |
| `functionNames` | `string[]` | `[]`          |

If you want the plugin to match on all functions with a specific name, no matter where it comes from you can specify them using this option. An example for this is if you have `clsx` as a global function and thus don't import it.

```json
{
  "plugins": [
    [
      "babel-plugin-optimize-clsx",
      {
        "functionNames": ["myClsxImplementation"]
      }
    ]
  ]
}
```
