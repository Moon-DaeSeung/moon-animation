import perrDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { babel } from '@rollup/plugin-babel'

const extensions = ['js', 'jsx', 'ts', 'tsx']
const packageJson = require('./package.json')

process.env.BABEL_ENV = 'production'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    perrDepsExternal(),
    resolve({ extensions }),
    commonjs({ include: /node_modules/ }),
    typescript({ useTsconfigDeclarationDir: true }),
    babel({
      extensions,
      include: ['src/**/*'],
      exclude: /node_modules/,
      babelHelpers: 'bundled'
    })
  ]
}
