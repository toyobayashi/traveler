import * as webpack from 'webpack'
import webpackConfig from './webpack.config'
import config from './config'

if (process.env.NODE_ENV === 'production') {
  webpack([webpackConfig.mainConfig, webpackConfig.rendererConfig], (err, stats) => {
    if (err) return console.log(err)
    console.log(stats.toString({
      colors: true
    }) + '\n')
  })
} else {
  const mainCompiler = webpack(webpackConfig.mainConfig)
  mainCompiler.watch({
    aggregateTimeout: 200,
    poll: undefined
  }, (err, stats) => {
    if (err) return console.log(err)
    console.log(stats.toString({
      colors: true,
      children: false,
      entrypoints: false,
      modules: false
    }) + '\n')
  })

  import('webpack-serve').then(serve => serve({}, {
    config: webpackConfig.rendererConfig,
    hotClient: {
      reload: false,
      port: config.websocketPort,
      validTargets: ['electron-renderer']
    },
    port: config.devServerPort
  }))
}
