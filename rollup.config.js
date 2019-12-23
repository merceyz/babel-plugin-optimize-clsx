import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { existsSync } from 'fs';
import path from 'path';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    sourcemap: true,
    format: 'cjs',
  },
  plugins: [
    {
      name: 'local-resolve',
      resolveId(importee, importer) {
        if (!importer || path.isAbsolute(importee) || !importee.startsWith('.')) {
          return null;
        }

        const fileName = path.basename(importee, '.js');
        const dirName = path.dirname(importee);
        const filePath = path.join(path.dirname(importer), dirName, `${fileName}.ts`);

        return existsSync(filePath) ? filePath : null;
      },
    },
    babel({
      exclude: 'node_modules/**',
      extensions: [...DEFAULT_EXTENSIONS, '.ts'],
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
