clsx(
  'foo',
  classes.root,
  !print && 'datatables-noprint',
  options.responsive === 'stacked' && classes.cellStacked,
);
