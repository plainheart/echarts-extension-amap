import path from 'node:path'
import chalk from 'chalk'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import { name, version } from './package.json'

const resolve = p => path.resolve(__dirname, p)

const outputConfigs = {
  esm: {
    file: resolve(`dist/${name}.esm.js`),
    format: 'es'
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  umd: {
    file: resolve(`dist/${name}.js`),
    format: 'umd'
  }
}

const env = process.env.NODE_ENV
const isProd = env === 'production'

console.log(chalk.bgCyan(`🚩 Building ${version} for ${env}... `))

const packageFormats = isProd
  ? ['esm', 'cjs', 'umd']
  : ['umd']

const packageConfigs = packageFormats.map(
  format => createConfig(format, outputConfigs[format])
)

if (isProd) {
  packageFormats.forEach(format => {
    if (format === 'umd') {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

function createConfig(format, output, specificPlugins = []) {
  output.externalLiveBindings = false

  const isUMDBuild = format === 'umd'

  if (isUMDBuild) {
    output.name = 'echarts.amap'
    output.sourcemap = isProd
  }

  output.interop = 'esModule'

  const external = ['echarts/lib/echarts']
  output.globals = {
    // For UMD `global.echarts`
    [external[0]]: 'echarts'
  }

  output.validate = isProd
  output.banner = isProd && require('./build/header').getLicense()

  const plugins = []

  if (isProd) {
    plugins.push(
      babel({
        babelHelpers: 'bundled'
      })
    )
  } else {
    plugins.push({
      outro() {
        return 'exports.bundleVersion = \'' + (+new Date()) + '\';'
      }
    })
  }

  return {
    input: resolve('index.js'),
    external,
    plugins: [
      json(),
      nodeResolve(),
      commonjs(),
      ...plugins,
      ...specificPlugins
    ],
    output,
    treeshake: {
      moduleSideEffects: false
    }
  }
}

function createMinifiedConfig(format) {
  return createConfig(
    format,
    {
      file: outputConfigs[format].file.replace(/\.js$/, '.min.js'),
      format: outputConfigs[format].format
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
          pure_funcs: ['console.log']
        },
        safari10: true,
        ie8: false
      })
    ]
  )
}

export default packageConfigs
