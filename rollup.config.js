import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import inject from 'rollup-plugin-inject'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

if (!process.env.DIST_NAME) throw Error("You must specify the DIST_NAME environment variable");
if (!process.env.MODULE_NAME) throw Error("You must specify the MODULE_NAME environment variable");

const prod = process.env.PRODUCTION
const env = prod ? 'production' : 'development'

console.log(`Creating ${env} bundle...`)

const targets = prod ?
  [
    { dest: `dist/${process.env.DIST_NAME}.min.js`, format: 'umd' },
  ] :
  [
    { dest: `dist/${process.env.DIST_NAME}.js`, format: 'umd' },
    { dest: `dist/${process.env.DIST_NAME}.es.js`, format: 'es' },
  ]

const plugins = [
  babel({
    exclude: 'node_modules/**',
    babelrc: false,
    presets: [
      'es2015-rollup',
      'react',
      'stage-2'
    ],
    plugins: [
      'external-helpers',
    ],
  }),
  commonjs(),
  nodeResolve(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development'),
  }),
]

if (prod) plugins.push(uglify())

export default {
  entry: 'src/index.js',
  exports: 'named',
  external: ['react'],
  globals: { react: 'React' },
  moduleName: process.env.MODULE_NAME,
  plugins,
  targets,
}

