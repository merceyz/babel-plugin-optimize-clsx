const clsx = require('clsx');
const getClassName = require('../getClassName');

const classes = {
  root: getClassName(),
  text: getClassName(),
  textPrimary: getClassName(),
  textSecondary: getClassName(),
  contained: getClassName(),
  containedPrimary: getClassName(),
  containedSecondary: getClassName(),
  outlined: getClassName(),
  outlinedPrimary: getClassName(),
  outlinedSecondary: getClassName(),
  disabled: getClassName(),
  fullWidth: getClassName(),
  colorInherit: getClassName(),
};

const variant = 'buffer';
const color = 'secondary';
const classNameProp = getClassName();
const text = true;
const contained = false;
const fullWidth = true;
const disabled = false;

module.exports = [
  'Extract properties and combine arguments',
  () => {
    return clsx(
      classes.root,
      {
        [classes.text]: text,
        [classes.textPrimary]: text && color === 'primary',
        [classes.textSecondary]: text && color === 'secondary',
        [classes.contained]: contained,
        [classes.containedPrimary]: contained && color === 'primary',
        [classes.containedSecondary]: contained && color === 'secondary',
        [classes.outlined]: variant === 'outlined',
        [classes.outlinedPrimary]: variant === 'outlined' && color === 'primary',
        [classes.outlinedSecondary]: variant === 'outlined' && color === 'secondary',
        [classes.disabled]: disabled,
        [classes.fullWidth]: fullWidth,
        [classes.colorInherit]: color === 'inherit',
      },
      classNameProp,
    );
  },
  () => {
    return clsx(
      classes.root,
      classNameProp,
      text && [
        classes.text,
        color === 'primary' && classes.textPrimary,
        color === 'secondary' && classes.textSecondary,
      ],
      contained && [
        classes.contained,
        color === 'primary' && classes.containedPrimary,
        color === 'secondary' && classes.containedSecondary,
      ],
      variant === 'outlined' && [
        classes.outlined,
        color === 'primary' && classes.outlinedPrimary,
        color === 'secondary' && classes.outlinedSecondary,
      ],
      disabled && classes.disabled,
      fullWidth && classes.fullWidth,
      color === 'inherit' && classes.colorInherit,
    );
  },
];
