const DefaultSettings = {
  libraries: ['clsx', 'classnames'],
  functionNames: [],
  removeUnnecessaryCalls: true,
};

module.exports = options => {
  return { ...DefaultSettings, ...options };
};
