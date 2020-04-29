var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

var baseWebpackConfig, config;

var NunjucksPlugin = require('rnjs-webpack-plugin-nunjucks');

function genHtmlWebpackPlugin() {
  var arr = [];
  arr.push(new NunjucksPlugin({
    viewRoot: `../src/${ config.build.viewSrcDirectory }/`
  }))
  var pages = Object.keys(utils.getEntry(`src/${ config.build.viewSrcDirectory }/**/*.html`, `src/${ config.build.viewSrcDirectory }/`));
  pages.forEach(function (pathname) {
    var conf = {
      filename: `${ pathname }.html`, // 生成的html存放路径，相对于path
      template: `src/${ config.build.viewSrcDirectory }/${ pathname }.html`, // html模板路径
      inject: true,
      chunks: [`${pathname}`]
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr;
}

module.exports = function (config0) {
  config = config0;
  baseWebpackConfig = require('./webpack.base.conf')(config);
  
  // add hot-reload related code to entry chunks
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
  })
  return merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': config.dev.env,
        stats: "errors-only"
      }),
      // copy custom static assets
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
          ignore: ['.*']
        }
      ]),
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new FriendlyErrorsPlugin()
    ].concat(genHtmlWebpackPlugin())
  })
  
}