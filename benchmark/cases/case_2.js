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
  () => {
    clsx(
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
    clsx(
      classes.root,
      classNameProp,
      variant === 'outlined' && [
        classes.outlined,
        color === 'primary' && classes.outlinedPrimary,
        color === 'secondary' && classes.outlinedSecondary,
      ],
      color === 'secondary' && [
        text && classes.textSecondary,
        contained && classes.containedSecondary,
      ],
      color === 'primary' && [text && classes.textPrimary, contained && classes.containedPrimary],
      text && classes.text,
      contained && classes.contained,
      disabled && classes.disabled,
      fullWidth && classes.fullWidth,
      color === 'inherit' && classes.colorInherit,
    );
  },
];
