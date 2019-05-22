clsx({
  [classes.root]: false,
  [classes.cellHide]: true,
  [classes.cellStacked]: options.responsive === 'stacked',
  'datatables-noprint': !print,
});
