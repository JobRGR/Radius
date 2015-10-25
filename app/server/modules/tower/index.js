var async = require('async')
var mongoose = require('../index')
var Schema = mongoose.Schema

var schema = new Schema({
  area: {
    type: String,
    unique: false,
    required: true
  },
  lat: {
    type: Number,
    unique: false,
    required: true
  },
  lng: {
    type: Number,
    unique: false,
    required: true
  },
  radius: {
    type: Number,
    unique: false,
    required: true
  }
})

schema.statics.addValue = function(area, lat, lng, radius, callback) {
  var Tower = this
  var tower = new Tower({
    area: area,
    lat: lat,
    lng: lng,
    radius: radius,
    name: Date.now() + Math.random() * Math.random()
  })
  tower.save(function(err) {
    callback(err, tower)
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
