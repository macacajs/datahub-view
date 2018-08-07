'use strict';

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const pkg = require('./package');


const DataHub = require('macaca-datahub');
const datahubProxyMiddle = require('datahub-proxy-middleware');

const datahubConfig = {
  port: 5678,
  hostname: 'localhost',
  store: path.join(__dirname, 'data'),
  proxy: {
    '^/datahubview': {
      hub: 'datahubview',
    },
  },
  view: {
    // use local resource for test
    assetsUrl: 'http://localhost:8080',
  },
};

const defaultDatahub = new DataHub({
  port: datahubConfig.port,
});
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const webpackConfig = {
    stats: {
      publicPath: true,
      chunks: false,
      modules: false,
      children: false,
      entrypoints: false,
      chunkModules: false,
    },

    devtool: isProduction ? false : 'source-map',

    entry: {
      [pkg.name]: path.join(__dirname, 'src', 'app'),
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist',
      filename: '[name].js',
      chunkFilename: '[name].js',
    },

    resolve: {
      extensions: [
        '.js',
        '.jsx',
      ],
    },

    module: {
      rules: [
        {
          test: /\.js[x]?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        }, {
          test: /\.json$/,
          type: 'javascript/auto',
          use: 'json-loader',
          exclude: /node_modules/,
        }, {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        }, {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].css',
      }),
    ],
    devServer: {
      hot: true,
      stats: 'errors-only',
      before: app => {
        datahubProxyMiddle(app)(datahubConfig);
      },
      after: () => {
        defaultDatahub.startServer(datahubConfig).then(() => {
        });
      },
    },
  };

  if (!isProduction) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (isProduction) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    webpackConfig.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              collapse_vars: false, // for https://github.com/visionmedia/debug/issues/547
            },
          },
        }),
      ],
    };
  }

  if (process.env.npm_config_report) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
  }

  return webpackConfig;
};
