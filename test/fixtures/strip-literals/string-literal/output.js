clsx(
  classes.root,

  options.responsive === 'stacked' && classes.cellStacked,
  !print && 'datatables-noprint',
);
