var path = require('path')

var lintLoader = '',
  options = process.argv
for (var i = 0, len = options.length; i < len; i++) {
  if (options[i] === '--lint') {
    lintLoader = '!eslint'
  }
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    publicPath: '/static/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      'src': path.resolve(__dirname, '../src')
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel' + lintLoader,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader:'style!css!'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 1024,
          name: '[name].[ext]?[hash:7]'
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      }
    ]
  },
  vue: {
    loaders: {
      js: 'babel' + lintLoader
    }
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  stats: { children: false }
}
