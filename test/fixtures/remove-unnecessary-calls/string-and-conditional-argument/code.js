const x1 = clsx('foo bar', foo ? 'a' : 'b');
const x2 = clsx(foo ? 'a' : 'b', 'foo bar');
const x3 = clsx('foo bar', foo ? 'a' : ``);
const x4 = clsx('foo bar', foo ? 'a' : '');
