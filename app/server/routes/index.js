var express = require('express')
var render = require('../handler/render')
var handler = require('../handler/api')

module.exports = function() {
  var app = express()
  var api = express.Router()

  api.get('/area', handler.area)
  api.get('/area/tower', handler.tower)
  api.get('/area/bgp', handler.bgp)

  app.use('/api', api)

  app.get('/', render.get)

  return app
}