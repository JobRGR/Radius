var async = require('async')

var Area = require('../modules/area').Area
var Tower = require('../modules/tower').Tower
var BGP = require('../modules/bgp').BGP

exports.area = function(req, res, next) {
  Area.getValues(req.params.id, function(err, areas) {
    if (err) next(err)
    res.send({area: areas})
  })
}

exports.tower = function(req, res, next) {
  Tower.getValues(req.params.id, function(err, towers) {
    if (err) next(err)
    res.send({tower: towers})
  })
}

exports.bgp = function(req, res, next) {
  BGP.getValues(req.params.id, function(err, bgps) {
    if (err) next(err)
    res.send({bgp: bgps})
  })
}

exports.points = function(req, res, next) {
  var id = req.params.id
  async.series({
    bgp: function(callback) {
      BGP.getValues(id, callback)
    },
    tower: function(callback) {
      Tower.getValues(id, callback)
    }
  }, function (err, result) {
    res.send({bgp: result.bgp, tower: result.tower})
  })
}

