var async = require('async')
var mongoose = require('../index'),
  Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  radius: {
    type: Number,
    required: true
  }
})

schema.statics.add = function(name, latitude, longitude, radius, callback) {
  var Area = this;
  var area = new Area({
    name: name,
    latitude: latitude,
    longitude: longitude,
    radius: radius
  })
  area.save(function(err) {
    callback(err, area);
  })
}

exports.Admin = mongoose.model('Area', schema)
