module.exports = {
  plugins: [
    'babel-plugin-lodash',
    '@babel/plugin-transform-typescript',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 8,
        },
      },
    ],
  ],
};
