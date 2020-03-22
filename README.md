# babel-plugin-optimize-clsx

Babel plugin to optimize the use of [clsx](https://github.com/lukeed/clsx), [classnames](https://github.com/JedWatson/classnames), and all libraries with a compatible API

## Install

```
yarn add babel-plugin-optimize-clsx --dev
or
npm install babel-plugin-optimize-clsx --save-dev
```

## Requirements

| Name  | Version |
| ----- | ------- |
| Babel | ^7.0.0  |
| Node  | >=8     |

## Examples

### Object properties

```javascript
clsx({
	[classes.disabled]: disabled,
	[classes.focusVisible]: focusVisible && !disabled,
});

// Transforms to

clsx(disabled && classes.disabled, focusVisible && !disabled && classes.focusVisible);
```

### Conditional expressions

```javascript
clsx({
	[classes.disabled]: disabled,
	[classes.focusVisible]: focusVisible && !disabled,
});

// Transforms to

clsx(disabled ? classes.disabled : focusVisible && classes.focusVisible);
```

### Combine arguments

```javascript
clsx({
	[classes.focusVisible]: this.state.focusVisible,
	[focusVisibleClassName]: this.state.focusVisible,
});

// Transforms to

clsx(this.state.focusVisible && [classes.focusVisible, focusVisibleClassName]);
```

### PropTypes

```javascript
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

// Transforms to

function foo(props) {
	const { position: p } = props;
	const x = clsx(p === 'top' ? classes.x : classes.y);
}

foo.propTypes = {
	position: PropTypes.oneOf(['top', 'bottom']),
};
```

### String literals

```javascript
const x = clsx({
	btn: true,
	'col-md-1': true,
	['btn-primary']: true,
});

// Transforms to

const x = 'btn col-md-1 btn-primary';
```

### Unnecessary function calls

```javascript
const x = clsx({
	btn: true,
	'btn-foo': isDisabled,
	'btn-bar': !isDisabled,
});

// Transforms to

const x = 'btn ' + (isDisabled ? 'btn-foo' : 'btn-bar');
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

By default the plugin will remove unnecessary function calls and if all calls are removed, imports. If you need to keep them, you can set this option to false.

Example of some unnecessary calls

```javascript
import clsx from 'clsx';
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

---

| Name           | Type      | Default value |
| -------------- | --------- | ------------- |
| `collectCalls` | `boolean` | `false`       |

Writes all function calls, before they are optimized, to a file. Used to help test the plugin on repositories.
