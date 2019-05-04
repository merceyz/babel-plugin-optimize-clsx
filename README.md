# babel-plugin-optimize-clsx

Babel plugin to optimize `clsx` and `classNames` function calls

## Install

```
yarn add babel-plugin-optimize-clsx --dev
or
npm install babel-plugin-optimize-clsx --save-dev
```

## Example

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
