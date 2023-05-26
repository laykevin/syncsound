const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    index: path.join(__dirname, 'client/src/index.tsx'),
  },
  output: {
    path: path.join(__dirname, '/client/dist'),
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
  devServer: {
    // contentBase: './client/dist',
    // proxy: {
    //   '/api': 'http://localhost:3001',
    // },
    static: {
      directory: path.join(__dirname, 'client/dist'),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [{ from: 'client/public', to: '.' }],
    // }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './client/public/index.html',
    }),
  ],
};

module.exports = config;
