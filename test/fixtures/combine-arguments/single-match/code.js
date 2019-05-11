clsx(
  foo && classes.text,
  bar && classes.text,
  text && classes.text,
  color === 'foo' && text && classes.text,
  text && color === 'bar' && classes.textPrimary,
  text && color === 'baz' && classes.textSecondary,
);
