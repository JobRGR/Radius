var mongoose = require('mongoose')
var uri = require('./config').uri

var options = {
  options: {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  }
}

mongoose.connect(uri, options)
module.exports = mongoose
