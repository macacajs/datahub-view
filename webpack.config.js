'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {

  devtool: isProduction ? false : '#source-map',

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
  },
};
