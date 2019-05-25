export function getOptions(options) {
  const DefaultSettings = {
    libraries: ['clsx', 'classnames'],
    functionNames: [],
    removeUnnecessaryCalls: true,
  };
  return { ...DefaultSettings, ...options };
}
