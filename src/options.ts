const DefaultSettings = {
	libraries: ['clsx', 'classnames'],
	functionNames: [] as string[],
	removeUnnecessaryCalls: true,
	collectCalls: false,
};

export type PluginOptions = typeof DefaultSettings;

export function getOptions(options: Partial<PluginOptions> = {}) {
	return { ...DefaultSettings, ...options };
}
