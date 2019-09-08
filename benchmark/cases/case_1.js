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

module.exports = {
  title: 'Extract properties, combine arguments, and conditional expression',
  before(clsx) {
    return clsx(classes.bar, {
      [classes.barColorPrimary]: color === 'primary' && variant !== 'buffer',
      [classes.colorPrimary]: color === 'primary' && variant === 'buffer',
      [classes.barColorSecondary]: color === 'secondary' && variant !== 'buffer',
      [classes.colorSecondary]: color === 'secondary' && variant === 'buffer',
      [classes.bar2Indeterminate]: variant === 'indeterminate' || variant === 'query',
      [classes.bar2Buffer]: variant === 'buffer',
    });
  },
  after(clsx) {
    return clsx(
      classes.bar,
      (variant === 'indeterminate' || variant === 'query') && classes.bar2Indeterminate,
      variant === 'buffer'
        ? [
            classes.bar2Buffer,
            {
              primary: classes.colorPrimary,
              secondary: classes.colorSecondary,
            }[color],
          ]
        : {
            primary: classes.barColorPrimary,
            secondary: classes.barColorSecondary,
          }[color],
    );
  },
};
