const x = clsx({
  foo1: true,
  foo2: foo,
  foo3: foo,
  foo4: !foo && !bar,
  foo5: !foo && bar,
  foo6: true,
});
