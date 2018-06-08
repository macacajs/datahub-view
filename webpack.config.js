'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';

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
  showBoard: true,
  view: {
    // use local resource for test
    assetsUrl: 'http://localhost:8080',
  },
};

const defaultDatahub = new DataHub({
  port: datahubConfig.port,
});
module.exports = {

  devtool: isProduction ? false : 'source-map',

  entry: {
    [pkg.name]: path.join(__dirname, 'src', 'app'),
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    filename: '[name].js',
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
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    before: app => {
      datahubProxyMiddle(app)(datahubConfig);
    },
    after: () => {
      defaultDatahub.startServer(datahubConfig).then(() => {
        console.log('datahub ready');
      });
    },
  },
};
