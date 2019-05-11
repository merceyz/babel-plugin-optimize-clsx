clsx(
  text && [
    classes.text,
    color === 'foo' && classes.text,
    color === 'bar' && classes.textPrimary,
    color === 'baz' && classes.textSecondary,
  ],
  foo && classes.text,
  bar && classes.text,
);
