import * as path from 'path'
import { Configuration, Output, HotModuleReplacementPlugin } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import * as webpackNodeExternals from 'webpack-node-externals'
import { VueLoaderPlugin } from 'vue-loader'
import { publicPath } from './config.json'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

let mainConfig: Configuration = {
  mode,
  context: path.join(__dirname, '..'),
  target: 'electron-main',
  entry: {
    main: [path.join(__dirname, '../src/ts/main/index.ts')]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../public')
  },
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [webpackNodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.(jpg|png|ico|icns)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: './img/[name].[ext]'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
}

let rendererConfig: Configuration = {
  mode,
  context: path.join(__dirname, '..'),
  target: 'electron-renderer',
  entry: {
    renderer: [path.join(__dirname, '../src/ts/renderer/index.ts')]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../..', publicPath)
  },
  node: {
    __dirname: false,
    __filename: false
  },
  externals: [webpackNodeExternals({
    whitelist: [/webpack/]
  })],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: process.env.NODE_ENV !== 'production'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif|ico|icns)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: './img/[name].[ext]'
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.css']
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.join(__dirname, './index.template.ts')
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'dll',
          chunks: 'all'
        }
      }
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  const terserPlugin = () => new TerserWebpackPlugin({
    parallel: true,
    cache: true,
    terserOptions: {
      ecma: 8,
      output: {
        beautify: false
      }
    }
  })

  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
  rendererConfig.optimization = {
    ...(rendererConfig.optimization || {}),
    minimizer: [
      terserPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
  rendererConfig.externals = [webpackNodeExternals({
    whitelist: [/vue/]
  })]
  mainConfig.optimization = {
    minimizer: [terserPlugin()]
  }
} else {
  (rendererConfig.output as Output).publicPath = publicPath
  rendererConfig.devtool = mainConfig.devtool = 'eval-source-map'
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new ForkTsCheckerWebpackPlugin({
      vue: true
    }),
    new HotModuleReplacementPlugin()
  ]
}

export default { mainConfig, rendererConfig }
