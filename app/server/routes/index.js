var express = require('express')
var render = require('../handler/render')
var handler = require('../handler/api')

module.exports = function() {
  var app = express()
  var api = express.Router()
    .get('/area', handler.area)
    .get('/area/:id', handler.points)
    .get('/tower/:id', handler.tower)
    .get('/tower', handler.tower)
    .get('/bgp/:id', handler.bgp)
    .get('/bgp', handler.bgp)
    .get('/all', handler.all)

  app
    .use('/api', api)
    .get('/', render.get)

  return app
}