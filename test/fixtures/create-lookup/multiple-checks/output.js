clsx(
  {
    entered: classes.entered,
    exited: !inProp && collapsedHeight === '0px' && classes.hidden,
  }[state],
);
