clsx(
  'foo',
  classes.root,
  !print && 'datatables-noprint',
  {
    stacked: classes.cellStacked,
  }[options.responsive],
);
