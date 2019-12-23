module.exports = {
  plugins: ['babel-plugin-lodash', '@babel/plugin-transform-typescript'],
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
