const path = require('path');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const { getLicense } = require('./header');
const { name } = require('../package.json');

function getPlugins({ min, addBundleVersion }) {
  const plugins = [
    nodeResolve(),
    commonjs(),
    json()
  ];

  addBundleVersion && plugins.push({
    outro: function () {
      return 'exports.bundleVersion = \'' + (+new Date()) + '\';';
    }
  });

  min && plugins.push(terser({
    ie8: true
  }));

  return plugins;
}

module.exports = function (opt/*{ min, addBundleVersion }*/) {
  const outputFileName = name + (opt.min ? '.min.js' : '.js');
  return {
    plugins: getPlugins(opt),
    input: path.resolve(__dirname, '../src/index.js'),
    // deprecate by https://github.com/rollup/rollup/pull/2141
    // legacy: true,
    external: ['echarts'],
    output: {
      name: 'echarts.gmap',
      format: 'umd',
      sourcemap: !opt.min,
      banner: getLicense(),
      // legacy: true,
      file: path.resolve(__dirname, '../dist/', outputFileName),
      globals: {
        // For UMD `global.echarts`
        echarts: 'echarts'
      }
    },
    watch: {
      include: [
        path.resolve(__dirname, '../src/**')
      ]
    }
  }
}
