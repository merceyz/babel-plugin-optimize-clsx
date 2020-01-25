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

module.exports = {
  title: 'Extract properties and combine arguments',
  before(clsx) {
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
  after(clsx) {
    return clsx(
      classes.root,
      classNameProp,
      text && [
        classes.text,
        {
          primary: classes.textPrimary,
          secondary: classes.textSecondary,
        }[color],
      ],
      contained && [
        classes.contained,
        {
          primary: classes.containedPrimary,
          secondary: classes.containedSecondary,
        }[color],
      ],
      disabled && classes.disabled,
      fullWidth && classes.fullWidth,
      variant === 'outlined' && [
        classes.outlined,
        {
          primary: classes.outlinedPrimary,
          secondary: classes.outlinedSecondary,
        }[color],
      ],
      color === 'inherit' && classes.colorInherit,
    );
  },
};
