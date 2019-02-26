var webpack = require("webpack");
var isProd = process.argv.indexOf("-p") > -1;

module.exports = {
  entry: {
    amap: __dirname + "/src/index.js"
  },
  output: {
    libraryTarget: "umd",
    library: ["[name]"],
    path: __dirname + "/dist",
    filename: "echarts-extension-" + (isProd ? "[name].min.js" : "[name].js")
  },
  devtool: "source-map",
  externals: {
    echarts: "echarts"
  }
};
