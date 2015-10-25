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
    if (err) next(err)
    res.send({bgp: result.bgp, tower: result.tower})
  })
}

exports.all = function(req, res, next) {
  async.waterfall([
    function (cb) {
      Area.getValues(null, cb)
    },
    function (areas, cb) {
      async.reduce(areas, [], function(memo, item, callback) {
        Tower.getValues(item._id, function(err, towers) {
          item._doc.towers = towers || []
          memo.push(item)
          callback(null, memo)
        })
      }, cb)
    },
    function (areas, cb) {
      async.reduce(areas, [], function(memo, item, callback) {
        BGP.getValues(item._id, function(err, bgps) {
          item._doc.bgps = bgps || []
          memo.push(item)
          callback(null, memo)
        })
      }, cb)
    }
  ], function(err, area) {
    if (err) next(err)
    res.send({areas: area})
  })
}

