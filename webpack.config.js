const path = require('path')
const webpack = require('webpack')
const getClientEnvironment = require('./env')

const env = getClientEnvironment()

module.exports = {
  mode: 'production',
  target: 'electron-main',
  entry: {
    main: './main.js',
    preload: './preload.js',
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  node: {
    __dirname: false,
  },
  plugins: [ new webpack.DefinePlugin(env.stringified) ],
}
