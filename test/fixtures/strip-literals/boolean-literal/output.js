clsx(
  classes.cellHide,
  !print && 'datatables-noprint',
  {
    stacked: classes.cellStacked,
  }[options.responsive],
);
