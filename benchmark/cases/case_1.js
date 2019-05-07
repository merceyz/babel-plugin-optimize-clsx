const clsx = require('clsx');
const getClassName = require('../getClassName');

const classes = {
  bar: getClassName(),
  barColorPrimary: getClassName(),
  colorPrimary: getClassName(),
  barColorSecondary: getClassName(),
  colorSecondary: getClassName(),
  bar2Indeterminate: getClassName(),
  bar2Buffer: getClassName(),
};

const variant = 'buffer';
const color = 'secondary';

module.exports = [
  () => {
    clsx(classes.bar, {
      [classes.barColorPrimary]: color === 'primary' && variant !== 'buffer',
      [classes.colorPrimary]: color === 'primary' && variant === 'buffer',
      [classes.barColorSecondary]: color === 'secondary' && variant !== 'buffer',
      [classes.colorSecondary]: color === 'secondary' && variant === 'buffer',
      [classes.bar2Indeterminate]: variant === 'indeterminate' || variant === 'query',
      [classes.bar2Buffer]: variant === 'buffer',
    });
  },
  () => {
    clsx(
      classes.bar,
      (variant === 'indeterminate' || variant === 'query') && classes.bar2Indeterminate,
      variant === 'buffer' && [
        color === 'primary' && classes.colorPrimary,
        color === 'secondary' && classes.colorSecondary,
        classes.bar2Buffer,
      ],
      variant !== 'buffer' && [
        color === 'primary' && classes.barColorPrimary,
        color === 'secondary' && classes.barColorSecondary,
      ],
    );
  },
];
