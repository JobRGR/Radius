var async = require('async')
var mongoose = require('../index')
var Schema = mongoose.Schema

var schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
})

schema.statics.addValue = function(name, lat, lng, callback) {
  var Area = this
  Area.findOne({name: name}, function(err, areas) {
    if (areas) return callback(new Error('422 - Entity Already Exists'))
    var area = new Area({
      name: name,
      lat: lat,
      lng: lng
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
