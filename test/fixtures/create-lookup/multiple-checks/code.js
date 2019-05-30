clsx({
  [classes.entered]: 'entered' === state,
  [classes.hidden]: state === 'exited' && !inProp && collapsedHeight === '0px',
});
