# babel-plugin-optimize-clsx

Babel plugin to optimize `clsx` and `classNames` function calls

## Install

```
yarn add babel-plugin-optimize-clsx --dev
or
npm install babel-plugin-optimize-clsx --save-dev
```

## Example

### Extract object properties

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

### Extract and create conditional expression

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
clsx('foo', 'bar', disabled ? classes.disabled : focusVisible && classes.focusVisible);
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

### Using proptypes

Transforms

```javascript
import PropTypes from 'prop-types';
import clsx from 'clsx';

function foo(props) {
  const { position: p } = props;
  const x = clsx({
    [classes.x]: p === 'top',
    [classes.y]: p === 'bottom',
  });
}

foo.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']),
};
```

to

```javascript
import PropTypes from 'prop-types';
import clsx from 'clsx';

function foo(props) {
  const { position: p } = props;
  const x = clsx(p === 'top' ? classes.x : classes.y);
}

foo.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']),
};
```

## Benchmarks

Benchmarks can be found in the [`benchmark`](/benchmark) directory

## Options

| Name        | Type       | Default value            |
| ----------- | ---------- | ------------------------ |
| `libraries` | `string[]` | `['clsx', 'classnames']` |

By default the plugin looks for `import` and `require` statements for `clsx` and `classnames` and uses that to know which function calls to optimize. If you're using another library with a compatible API you can overwrite that with this option.

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

---

| Name                     | Type      | Default value |
| ------------------------ | --------- | ------------- |
| `removeUnnecessaryCalls` | `boolean` | `true`        |

By default the plugin will remove unnecessary function calls, if for some reason you need to keep them, you can set this option to false.

Example of some unnecessary calls

```javascript
const x = clsx('foo', 'bar');
const y = clsx({ classA: foo === 'a', classB: foo !== 'a' });
const z = clsx({
  classA: foo === 'a',
  classB: foo !== 'a',
  classC: bar === 'c',
  classD: bar !== 'c',
});

// Transforms to

const x = 'foo bar';
const y = foo === 'a' ? 'classA' : 'classB';
const z = (foo === 'a' ? 'classA ' : 'classB ') + (bar === 'c' ? 'classC' : 'classD');
```
