var fs = require('fs')
var path = require('path')
var rm = require('rimraf')
var rnjsHelper = require('rnjs-helper')
var utils = require('./utils')

const argArr = process.argv.slice(2);

// let copyToDir = '../../inxi/';
// 自动拷贝到本地服务器
let index = argArr.indexOf('__server')
let isCopyToServer = index > -1
if (isCopyToServer) {
  argArr.splice(index, 1)
  copyToDir = `//server/`;
}

// 自动拷贝到本地
index = argArr.indexOf('__liu')
let isCopyToLiu = index > -1
if (isCopyToLiu) {
  argArr.splice(index, 1)
  copyToDir = `E:\\git\\ruiyi\\`;
}

let dirList = argArr.length > 0 ? argArr : utils.getSrcDirNameList()
let wwwSubDirList = ['css', 'js', 'fonts']
const _rm = rnjsHelper.promisify(rm, rm)
for (let name of dirList) {
  const viewDir = `view/${name}`;
  const assetsDir = `static/${name}`;
  const copyLocal = async () => {
    await rnjsHelper.copyDir(path.resolve(__dirname, `../dist/${ viewDir }`), path.resolve(__dirname, `${ copyToDir }${ viewDir }`), true, true);
    if (wwwSubDirList && wwwSubDirList.length > 0) {
      for (let subDirName of wwwSubDirList) {
        await rnjsHelper.copyDir(path.resolve(__dirname, `../dist/${ assetsDir }/${subDirName}`), path.resolve(__dirname, `${ copyToDir }www/${ assetsDir }/${subDirName}`), true, true);
      }
    } else {
      await rnjsHelper.copyDir(path.resolve(__dirname, `../dist/${ assetsDir }`), path.resolve(__dirname, `${ copyToDir }www/${ assetsDir }`), true, true);
    }
  }
  rm(path.resolve(__dirname, `${ copyToDir }${ viewDir }`), async (err) => {
    if (wwwSubDirList && wwwSubDirList.length > 0) {
      for (let subDirName of wwwSubDirList) {
        await _rm(path.resolve(__dirname, `${ copyToDir }www/${ assetsDir }/${subDirName}`))
      }
    } else {
      await _rm(path.resolve(__dirname, `../dist/${ assetsDir }`))
    }
    await copyLocal()
  })
}