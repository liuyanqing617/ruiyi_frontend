// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

// 开发环境下的资源和接口代理
// const PROXY_TARGET = 'http://zgj.xinlong.server'
// const PROXY_TARGET = 'http://192.168.1.168:3002'//李树
// const PROXY_TARGET = 'http://192.168.1.114:3002'//
const PROXY_TARGET = 'http://192.168.0.107:5200'//
// const PROXY_TARGET = 'https://xlzgy.xinlongzichan.com'//线上环境
const PROXY_PATHS = ['/libs', '/static', '/upload', '/api/', '/m/']
// const PROXY_PATHS = ['/libs', '/static', '/upload', '/api/']
const PROXY_TABLE = {}
PROXY_PATHS.map(key => {
  PROXY_TABLE[key] = {
    target: PROXY_TARGET,
    // secure: false,       // 如果是https接口，需要配置这个参数
    changeOrigin: true,    // 如果接口跨域，需要进行这个参数配置
    pathRewrite: {
      ['^' + key]: key
  }
}
})

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    viewSrcDirectory: 'm/view',
    viewDistDirectory: 'view/m',
    assetsSubDirectory: 'static/m',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8082,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: PROXY_TABLE,
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
