var async = require('async')
var mongoose = require('../index'),
  point = require('../config').point,
  Schema = mongoose.Schema;

point.areas = {
  type: [Number],
  required: true
}

var schema = new Schema(point)

schema.statics.addValue = function(areas, latitude, longitude, radius, callback) {
  var BGP = this
  BGP.find({latitude: latitude, longitude: longitude}, function(err, bgps) {
    if (bgps) return callback(new Error('422 - Entity Already Exists'))
    var bgp = new BGP({
      area: areas,
      latitude: latitude,
      longitude: longitude,
      radius: radius
    })
    bgp.save(function(err) {
      callback(err, area)
    })
  })
}

schema.statics.getValues = function(id, callback) {
  var BGP = this
  var query = id ? {areas: id} : {}
  BGP.find(query, callback)
}

schema.statics.removeValues = function(callback) {
  var BGP = this
  BGP.remove({}, callback)
}

exports.BGP = mongoose.model('BGP', schema)
