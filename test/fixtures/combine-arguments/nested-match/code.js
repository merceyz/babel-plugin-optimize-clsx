clsx(
  text && classes.text,
  color === 'primary' && text && classes.text,
  text && color === 'primary' && classes.textPrimary,
  text && color === 'secondary' && classes.textSecondary,
);
