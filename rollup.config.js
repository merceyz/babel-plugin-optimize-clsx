import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    sourcemap: true,
    format: 'cjs',
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    terser({
      toplevel: true,
      compress: {
        pure_getters: true,
        pure_funcs: ['path.join'],
      },
    }),
  ],
};
