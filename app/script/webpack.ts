import * as webpack from 'webpack'
import webpackConfig from './webpack.config'
import config from './config'

const toStringOptions: webpack.Stats.ToStringOptionsObject = {
  colors: true,
  children: false,
  modules: false,
  entrypoints: false
}

const handler: webpack.ICompiler.Handler = (err, stats) => console.log(err || (stats.toString(toStringOptions) + '\n'))

if (require.main === module) {
  if (process.env.NODE_ENV === 'production') {
    webpack(webpackConfig.mainConfig, handler)
    webpack(webpackConfig.rendererConfig, handler)
  } else {
    const mainCompiler = webpack(webpackConfig.mainConfig)
    mainCompiler.watch({
      aggregateTimeout: 200,
      poll: undefined
    }, handler)

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
}

export function prod (callback?: Function): Promise<void> {
  const webpackPromise = (option: webpack.Configuration) => new Promise<void>((resolve, reject) => {
    webpack(option, (err, stats) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      console.log(stats.toString({
        colors: true,
        children: false,
        entrypoints: false,
        modules: false
      }) + '\n')
      resolve()
    })
  })

  return Promise.all([
    webpackPromise(webpackConfig.mainConfig),
    webpackPromise(webpackConfig.rendererConfig)
  ]).then(() => {
    if (callback) callback()
  })
}
