var mongoose = require('mongoose')

var uri = "mongodb://localhost/radius"
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