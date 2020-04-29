require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

let argArr = process.argv.slice(2);
if (argArr.length > 0) {
  let target = argArr[0];
  config.build.viewSrcDirectory = `${target}/view`;
  config.build.viewDistDirectory = `view/${target}`;
  config.build.assetsSubDirectory = `static/${target}`;
}

var opn = require('opn')
var path = require('path')
var Koa = require('koa');
var koaWebpack = require('koa-webpack');
var koaStatic = require('koa-static');
var webpack = require('webpack')

var webpackConfig = require('./webpack.dev.conf')(config)
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
var httpProxy = require('koa-proxies')
var httpProxyTable = config.dev.proxyTable
var compiler = webpack(webpackConfig)

const app = new Koa();
const koaMiddleware = koaWebpack({
  config: webpackConfig,
  compiler: compiler,
  dev: {
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    stats: 'errors-only'
  },
  hot: {
    log: (msg) => {
      // console.log(`HOT-LOG: ${ msg }`)
    },
    heartbeat: 2000
  }
});
app.use(koaMiddleware);

// proxy api requests
Object.keys(httpProxyTable).forEach(function (key) {
  app.use(httpProxy(key, httpProxyTable[key]));
})

app.use(koaStatic(__dirname + '/../'));

app.use((ctx, next) => {
  const startDate = new Date();
  next();
  console.log(`method: ${ctx.url} code: ${ctx.status} time:${new Date() -startDate}ms`);
});

const server = app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error(err)
    return
  }
  // console.log(`Listening at http://localhost:${port}`)
})
process.on('SIGTERM', () => {
  console.log('Stopping dev server')
  server.close(() => {
    process.exit(0)
  })
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    koaMiddleware.hot.publish({ action: 'reload' })
    cb()
  })
})


var uri = 'http://localhost:' + port
var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
koaMiddleware.dev.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
