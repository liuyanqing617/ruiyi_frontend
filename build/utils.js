var path = require('path')
var fs = require('fs')
var glob = require('glob')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}
exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: loaders,
      })
    } else {
      return ['style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader,
    })
  }
  return output
}

// 获取目录下所有指定文件
exports.getEntry = function (globPath, pathDir) {
  var files = glob.sync(globPath)
  var entries = {}, entry, dirname, basename, pathname, extname
  for (var i = 0; i < files.length; i++) {
    entry = files[i]
    dirname = path.dirname(entry)
    extname = path.extname(entry)
    basename = path.basename(entry, extname)
    pathname = path.normalize(path.join(dirname, basename))
    if (dirname.indexOf('components') === -1) {
      pathDir = path.normalize(pathDir)
      if (pathname.startsWith(pathDir)) {
        pathname = pathname.substring(pathDir.length)
      }
      pathname = pathname.replace(/\\/g, '/')
      entries[pathname] = ['./' + entry]
    }
  }
  return entries
}

exports.getSrcDirNameList = function () {
  let ignoreArr = ['components', 'css', 'fonts', 'img'];
  var srcPath = path.resolve(__dirname, '../src');
  let dirs = fs.readdirSync(srcPath);
  let list = []
  for (let name of dirs) {
    var stats = fs.statSync(path.join(srcPath, name));
    if (stats.isDirectory()) {
      if (ignoreArr.indexOf(name) > -1 || name[0] === '_') continue;
      list.push(name)
    }
  }
  return list
}
