module.exports = {
  plugins: ['babel-plugin-lodash'],
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
