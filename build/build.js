require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
const semver = require('semver');
const shell = require('child_process');
var webpack = require('webpack')
var config = require('../config')
var getWebpackConfig = require('./webpack.prod.conf')

const argArr = process.argv.slice(2);

var spinner = ora('building for production...')
spinner.start()

function onPackFinish (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  console.log(chalk.yellow('  Build complete.\n'))
}

let dirList = argArr.length > 0 ? argArr : utils.getSrcDirNameList()
for (let name of dirList) {
  let distDir = path.resolve(config.build.assetsRoot, name)
  rm(distDir, async function (err) {
    if (err) {
      console.log(err)
      return
    }
    config.build.viewSrcDirectory = `${name}/view`;
    config.build.viewDistDirectory = `view/${name}`;
    config.build.assetsSubDirectory = `static/${name}`;
    let webpackConfig = getWebpackConfig(config)
    await webpack(webpackConfig, onPackFinish);
  })
}
