'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {

  devtool: isProduction ? false : '#source-map',

  entry: {
    [pkg.name]: path.join(__dirname, 'src', 'app'),
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js',
  },

  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },

  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!less-loader',
        }),
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin(`${pkg.name}.css`),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
  },
};
