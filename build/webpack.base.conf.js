var path = require('path')
var utils = require('./utils')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var config;

module.exports = function (config0) {
  config = config0;
  return {
    entry: utils.getEntry(`src/${ config.build.viewSrcDirectory }/**/*.js`, `src/${ config.build.viewSrcDirectory }/`),
    output: {
      path: config.build.assetsRoot,
      filename: '[name].js',
      //  保持与webpack-dev-server的publicPath一致为 '/'
      publicPath: process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': resolve('src/'),
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        // $: 'jquery',
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src')],
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        {
          test: /\.(png|jpe?g|gif)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[ext]?[hash:10]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[ext]?[hash:10]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[ext]?[hash:10]')
          }
        },
      ],
    }
  }
};
