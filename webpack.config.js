const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    index: path.join(__dirname, 'client/src/index.tsx'),
  },
  output: {
    path: path.join(__dirname, 'client/dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
  },
  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, 'client/dist'),
  //   },
  //   compress: true,
  //   port: 8080,
  //   devMiddleware: {
  //     writeToDisk: true,
  //   },
  // },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './client/public/index.html',
    }),
  ],
};

module.exports = config;
