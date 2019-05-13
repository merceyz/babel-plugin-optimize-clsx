clsx(
  text && [
    classes.text,
    color === 'primary' && [classes.text, classes.textPrimary],
    color === 'secondary' && classes.textSecondary,
  ],
);
