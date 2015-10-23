var async = require('async')
var mongoose = require('../index'),
  point = require('../config').point,
  Schema = mongoose.Schema;


point.name = {
  type: String,
  unique: true,
  required: true
}

var schema = new Schema(point)

schema.statics.addValue = function(name, latitude, longitude, radius, callback) {
  var Area = this
  Area.find({name: name}, function(err, areas) {
    if (areas) return callback(new Error('422 - Entity Already Exists'))
    var area = new Area({
      name: name,
      latitude: latitude,
      longitude: longitude,
      radius: radius
    })
    area.save(function(err) {
      callback(err, area)
    })
  })
}

schema.statics.getValues = function(id, callback) {
  var Area = this
  var query = id ? {_id: id} : {}
  Area.find(query, callback)
}

schema.statics.removeValues = function(callback) {
  var Area = this
  Area.remove({}, callback)
}

exports.Area = mongoose.model('Area', schema)
