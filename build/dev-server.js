var path = require('path')
var fs = require('fs')
var https = require('https')
var express = require('express')
var webpack = require('webpack')
var config = require('./webpack.dev.conf')

var app = express()
var compiler = webpack(config)

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}))
app.use(require('webpack-hot-middleware')(compiler))

var options = {
  key: fs.readFileSync(path.join(__dirname, '../privatekey.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certificate.pem'))
}

https.createServer(options, app).listen(3011, function () {
  console.log('Https server listening on port ' + 3011);
})

module.exports = app.listen(8080, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + 8080 + '\n')
})
