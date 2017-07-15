/*global console*/

var webpack          = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config           = require('./webpack.config')

new WebpackDevServer(webpack(config), {
  publicPath         : config.output.publicPath,
  hot                : true,
  historyApiFallback : true
}).listen(config.devPort, function (err) {
  if (err) console.log(err)

  console.log('Listening at localhost:' + config.devPort)
})