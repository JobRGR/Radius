module.exports.getConfig = function(type) {
  var isDev = type === 'development'
  var config = {
    entry: './app/client/index.js',
    output: {
      path: __dirname,
      filename: 'bundle.js'
    },
    debug : isDev,
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    }
  }
  if (isDev) {
    config.devtool = 'source-map'
  }
  return config
}