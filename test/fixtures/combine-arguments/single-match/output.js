clsx(
	text && [
		classes.text,
		{
			foo: classes.text,
			bar: classes.textPrimary,
			baz: classes.textSecondary,
		}[color],
	],
	foo && classes.text,
	bar && classes.text
);
