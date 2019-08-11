clsx('', 'foo', {
  [classes.root]: 'true',
  [classes.cellHide]: '',
  [classes.cellHide2]: ``,
  [classes.cellStacked]: options.responsive === 'stacked',
  'datatables-noprint': !print,
});
