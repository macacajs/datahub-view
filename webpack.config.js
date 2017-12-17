'use strict';

const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';

class WebpackAfterAllPlugin {
  apply(compiler) {
    compiler.plugin('done', (compilation) => {
      setTimeout(() => {
        fs.writeFileSync(path.join(__dirname, '.ready'), '');
      }, 1000);
    });
  }
}

module.exports = {

  devtool: isProduction ? false : '#source-map',

  entry: {
    [pkg.name]: path.join(__dirname, 'src', 'app')
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'react',
              'env',
              'latest',
              'stage-2'
            ],
            plugins: [
              [
                'import',
                {
                  libraryName: 'antd',
                  style: 'css'
                }
              ]
            ]
          }
        }
      }, isProduction ? {} : {
        test: /\.js[x]?$/,
        enforce: 'post',
        exclude: /node_modules/,
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true,
          coverageVariable: '__macaca_coverage__'
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!less-loader'
        })
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(`${pkg.name}.css`),
    new WebpackAfterAllPlugin()
  ]
};
