const itemStyles = clsx(
  subclassPath &&
    {
      top: styles.subclassPathTop,
      middle: styles.subclassPathMiddle,
      bottom: styles.subclassPathBottom,
    }[subclassPath.position],
  searchHidden && styles.searchHidden,
);
clsx('foo', itemStyles);
