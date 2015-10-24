var async = require('async')
var mongoose = require('../index'),
  point = require('../config').point,
  Schema = mongoose.Schema;

point.area = {
  type: Number,
  required: true
}

var schema = new Schema(point)

schema.statics.addValue = function(area, latitude, longitude, radius, callback) {
  var Tower = this
  Tower.find({latitude: latitude, longitude: longitude}, function(err, towers) {
    if (towers) return callback(new Error('422 - Entity Already Exists'))
    var tower = new Tower({
      area: area,
      latitude: latitude,
      longitude: longitude,
      radius: radius
    })
    tower.save(function(err) {
      callback(err, area)
    })
  })
}

schema.statics.getValues = function(id, callback) {
  var Tower = this
  var query = id ? {area: id} : {}
  Tower.find(query, callback)
}

schema.statics.removeValues = function(callback) {
  var Tower = this
  Tower.remove({}, callback)
}

exports.Tower = mongoose.model('Tower', schema)
