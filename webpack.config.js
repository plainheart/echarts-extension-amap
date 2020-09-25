const path = require('path');
const webpack = require('webpack');

const ENTRY_NAME = 'amap';

module.exports = function (env, argv) {
  const isProd = env === 'production';
  return {
    mode: isProd ? 'production' : 'development',
    entry: {
      [ENTRY_NAME]: './src/index.js'
    },
    output: {
      libraryTarget: 'umd',
      library: ['echarts', ENTRY_NAME],
      umdNamedDefine: true,
      globalObject: 'this',
      path: path.resolve(__dirname, './dist'),
      pathinfo: !isProd,
      filename: 'echarts-extension-' + (isProd ? '[name].min.js' : '[name].js')
    },
    devtool: isProd ? false : 'source-map',
    externals: {
      echarts: 'echarts'
    }
  }
}
