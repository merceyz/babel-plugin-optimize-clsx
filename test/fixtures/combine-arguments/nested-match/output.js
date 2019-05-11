clsx(
  text && [
    color === 'primary' && [classes.text, classes.textPrimary],
    classes.text,
    color === 'secondary' && classes.textSecondary,
  ],
);
