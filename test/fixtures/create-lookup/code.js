clsx({
  [foo.a]: bar === 'up',
  [foo.b]: bar === 'down' && !inProp && collapsedHeight === '0px',
  [foo.c]: baz === 'left',
  [foo.d]: baz === 'right',
});
