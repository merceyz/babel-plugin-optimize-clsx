clsx(
  text && [
    classes.text,
    {
      primary: [classes.text, classes.textPrimary],
      secondary: classes.textSecondary,
    }[color],
  ],
);
