var webpack = require("webpack");
var { version } = require("./package.json");
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
  plugins: [
    new webpack.DefinePlugin({
      "process.env.VERSION": `"${version}"`
    })
  ],
  externals: {
    echarts: "echarts"
  }
};
