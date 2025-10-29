const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.js', 
  mode: 'development',
  devServer: {
    port: 8081,
    open: true,
  },
  output: {
    publicPath: 'http://localhost:8081/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'creditCardMFE1',
      filename: 'remoteEntry.js',
      exposes: {
        './CreditCardComponent': './src/CreditCardMFE.jsx',
      },
      shared: {
        // CRITICAL FIX FOR ISOLATION: Setting eager: true loads the dependency immediately
        react: {
          singleton: true,
          requiredVersion: deps.react,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
          eager: true,
        },
        redux: {
          singleton: true,
          requiredVersion: deps.redux,
          eager: true,
        },
        'react-redux': {
          singleton: true,
          requiredVersion: deps['react-redux'],
          eager: true,
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
