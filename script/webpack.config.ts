import * as path from 'path'
import { Configuration } from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import * as UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import * as webpackNodeExternals from 'webpack-node-externals'
import { VueLoaderPlugin } from 'vue-loader'
import ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

let mainConfig: Configuration = {
  mode,
  context: path.join(__dirname, '..'),
  target: 'electron-main',
  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : void 0,
  entry: {
    main: [path.join(__dirname, '../src/ts/main.ts')]
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
  devtool: process.env.NODE_ENV !== 'production' ? 'inline-source-map' : void 0,
  entry: {
    renderer: [path.join(__dirname, '../src/ts/index.ts')]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../public')
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
        test: /\.(jpg|png|ico|icns)$/,
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
  const uglifyJSPlugin = () => new UglifyJSPlugin({
    parallel: true,
    cache: true,
    uglifyOptions: {
      ecma: 8,
      output: {
        comments: false,
        beautify: false
      },
      warnings: false
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
      uglifyJSPlugin(),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
  rendererConfig.externals = [webpackNodeExternals({
    whitelist: [/vue/]
  })]
  mainConfig.optimization = {
    minimizer: [uglifyJSPlugin()]
  }
} else {
  rendererConfig.plugins = [
    ...(rendererConfig.plugins || []),
    new ForkTsCheckerWebpackPlugin({
      vue: true
    })
  ]
}

export default { mainConfig, rendererConfig }
