import * as webpack from 'webpack'
import webpackConfig from './webpack.config'
import { devServerHost, devServerPort, publicPath } from './config.json'
import { join } from 'path'
import { Configuration } from 'webpack-dev-server'
import { removeSync } from 'fs-extra'

const toStringOptions: webpack.Stats.ToStringOptionsObject = {
  colors: true,
  children: false,
  modules: false,
  entrypoints: false
}

const handler: webpack.ICompiler.Handler = (err, stats) => console.log(err || (stats.toString(toStringOptions) + '\n'))

if (require.main === module) {
  if (process.env.NODE_ENV === 'production') {
    prod()
  } else {
    if (webpackConfig.rendererConfig.output && webpackConfig.rendererConfig.output.path) removeSync(webpackConfig.rendererConfig.output.path)
    const mainCompiler = webpack(webpackConfig.mainConfig)
    mainCompiler.watch({
      aggregateTimeout: 200,
      poll: undefined
    }, handler)

    import('webpack-dev-server').then(devServer => {
      const options: Configuration = {
        stats: {
          colors: true
        },
        host: devServerHost,
        hotOnly: true,
        inline: true,
        contentBase: join(__dirname, '../..'),
        publicPath: publicPath
      }
      devServer.addDevServerEntrypoints(webpackConfig.rendererConfig, options)

      const server = new devServer(webpack(webpackConfig.rendererConfig), options)
      server.listen(devServerPort, devServerHost, () => {
        console.log('webpack server start.')
      })
    })
  }
}

export function prod (callback?: Function): Promise<void> {
  const webpackPromise = (option: webpack.Configuration) => new Promise<void>((resolve, reject) => {
    webpack(option, (err, stats) => {
      if (err) {
        console.log(err)
        return reject(err)
      }
      console.log(stats.toString(toStringOptions) + '\n')
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
