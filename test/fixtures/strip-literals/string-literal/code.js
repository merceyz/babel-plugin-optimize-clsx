clsx('', 'foo', {
  [classes.root]: 'true',
  [classes.cellHide]: '',
  [classes.cellStacked]: options.responsive === 'stacked',
  'datatables-noprint': !print,
});
