var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var getBaseWebpackConfig = require('./webpack.base.conf')
var merge = require('webpack-merge')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var fs = require('fs')

var baseWebpackConfig, config;

var DelTestCodePlugin = require('rnjs-webpack-plugin-deltestcode');

function genHtmlWebpackPlugin () {
  var arr = [];
  arr.push(new DelTestCodePlugin())
  var pages = Object.keys(utils.getEntry(`src/${ config.build.viewSrcDirectory }/**/*.html`, `src/${ config.build.viewSrcDirectory }/`));
  pages.forEach(function (pathname) {
    var conf = {
      filename: `${config.build.assetsRoot}/${ config.build.viewDistDirectory }/${ pathname }.html`, // 生成的html存放路径，相对于path
      template: `src/${ config.build.viewSrcDirectory }/${ pathname }.html`, // html模板路径
      inject: false,     // 默认不插入，只有存在同名JS时才插入
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      },
    }
    if (pathname in baseWebpackConfig.entry) {
      conf.inject = true;
      // conf.chunks = [`${pathname}`, 'vendor', 'manifest'];  // 这里输入需要提取公共代码的entry
      conf.chunks = [`${pathname}`];  // 这里输入需要提取公共代码的entry
      conf.chunksSortMode = 'dependency';
      conf.hash = true;
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  return arr;
}

var getWebpackConfig = function (config0) {
  config = config0;
  baseWebpackConfig = getBaseWebpackConfig(config);
  
  let copyConfig = [];
  let copyFrom = path.resolve(__dirname, '../', config.build.assetsSubDirectory);
  if (fs.existsSync(copyFrom)) {
    copyConfig.push({
      from: copyFrom,
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    })
  }
  
  var webpackConfig = merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true
      })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
      path: config.build.assetsRoot,
      filename: utils.assetsPath('js/[name].js'),
      chunkFilename: utils.assetsPath('js/[id].chunk.js?[chunkhash:10]')
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': config.build.env
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        sourceMap: false,
        comments: false,
        except: ['$super', '$', 'exports', 'require'] // 排除关键字
      }),
      // extract css into its own file
      new ExtractTextPlugin({
        filename: utils.assetsPath('css/[name].css?[contenthash:10]')
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      // split vendor js into its own file
      // 暂不生成 vendor
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'vendor',
      //   minChunks: function (module, count) {
      //     // any required modules inside node_modules are extracted to vendor
      //     return (
      //       module.resource &&
      //       /\.js$/.test(module.resource) &&
      //       module.resource.indexOf(
      //         path.join(__dirname, '../node_modules')
      //       ) === 0
      //     )
      //   }
      // }),
      // extract webpack runtime and module manifest to its own file in order to
      // prevent vendor hash from being updated whenever app bundle is updated
      // 暂不生成 manifest
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest',
      //   chunks: ['vendor']
      // }),
      // copy custom static assets
      new CopyWebpackPlugin(copyConfig)
    ].concat(genHtmlWebpackPlugin(baseWebpackConfig))
  })
  
  if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')
    
    webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          config.build.productionGzipExtensions.join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }
  
  if (config.build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }
  
  return webpackConfig;
}


module.exports = getWebpackConfig
