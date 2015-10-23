var express = require('express')
var render = require('../handler/render')
var handler = require('../handler/api')

module.exports = function() {
  var app = express()
  var api = express.Router()

  api.get('/area', handler.area)
  api.get('/area/:id', handler.points)
  api.get('/tower/:id', handler.tower)
  api.get('/bgp/:id', handler.bgp)

  app.use('/api', api)

  app.get('/', render.get)

  return app
}