export function getOptions(options) {
  const DefaultSettings = {
    libraries: ['clsx', 'classnames'],
    functionNames: [],
    removeUnnecessaryCalls: true,
    collectCalls: false,
  };
  return { ...DefaultSettings, ...options };
}
