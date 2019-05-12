const DefaultSettings = {
  libraries: ['clsx', 'classnames'],
  functionNames: [],
};

module.exports = options => {
  return { ...DefaultSettings, ...options };
};
