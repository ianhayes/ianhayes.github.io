/*global __dirname*/
var config    = require('./package.json'),
    webpack   = require('webpack'),
    path      = require('path'),
    extract   = require('extract-text-webpack-plugin'),
    // glob      = require('glob'),
    isDev     = process.env.NODE_ENV != "production",
    devPort   = process.env.PORT || 3010,
    sassPaths = require("node-neat").includePaths,
    precss = require('precss'),
    autoprefixer = require('autoprefixer')

// Set up the entry points
var entry = []

entry.push('./app/js/app.js')

// Setup output
var output = {
  path: path.join(__dirname, 'compiled'),
  filename: 'js/app.js',
  publicPath: '/compiled/'
}

// Setup plugins
var plugins = []


  plugins.push(new webpack.optimize.UglifyJsPlugin())
  plugins.push(new webpack.optimize.OccurenceOrderPlugin())
  plugins.push(new webpack.optimize.DedupePlugin())

plugins.push(new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
}))
plugins.push(new webpack.NoErrorsPlugin())
plugins.push(new extract("css/app.css"))

// Main webpack config
module.exports = {
  devPort: devPort,
  devtool: 'source-map',
  entry: entry,
  output: output,
  externals: {
    jquery: "jQuery"
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /node_modules\/flickity/,
        loader: 'imports?define=>undefined'
      },
      {
        test: /packery/,
        loader: 'imports?define=>false&this=>window'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        include: path.join(__dirname, 'app'),
        query: {
          presets: ['es2015', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        loader: extract.extract(
          "style-loader",
          "css!postcss-loader!sass-loader?sourceMap&includePaths[]=" + sassPaths.join("&includePaths[]=")
        )
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.(otf|eot|png|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=100000'
      },
      {
        test: /\.(jpe?g|png|gif)/,
        loader:  'file'
      }
    ]
  },
  plugins: plugins,
  postcss : function () {
    return [autoprefixer({ browsers: ['last 5 versions'] }), precss];
  }
}
