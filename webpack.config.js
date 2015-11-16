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
      }, {
        test: /\.css$/,
        loader: "style!css"
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url?limit=10000!img?progressive=true'
      }]
    }
  }
  if (isDev) {
    config.devtool = 'source-map'
  }
  return config
}