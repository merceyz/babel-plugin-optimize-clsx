clsx(
  color === 'primary' && text && [classes.text, classes.textPrimary],
  text && [classes.text, color === 'secondary' && classes.textSecondary],
);
