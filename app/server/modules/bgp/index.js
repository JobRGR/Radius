var async = require('async')
var mongoose = require('../index')
var Schema = mongoose.Schema


var schema = new Schema({
  area: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  radius: {
    type: Number,
    required: true
  }
})

schema.statics.addValue = function(area, lat, lng, radius, callback) {
  var BGP = this
  var bgp = new BGP({
    area: area,
    lat: lat,
    lng: lng,
    radius: radius
  })
  bgp.save(function(err) {
    callback(err, bgp)
  })
}

schema.statics.getValues = function(id, callback) {
  var BGP = this
  var query = id ? {area: id} : {}
  BGP.find(query, callback)
}

schema.statics.removeValues = function(callback) {
  var BGP = this
  BGP.remove({}, callback)
}

exports.BGP = mongoose.model('BGP', schema)
