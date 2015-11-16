var fs = require('fs')
var path = require('path')

var async = require('async')
var key = require('../config').key
var googleplaces = require('googleplaces')(key, 'json')

var Area = require('../area').Area
var Tower = require('../tower').Tower
var BGB = require('../bgp').BGP

var states = [
  "АР Крим",
  "Вінницька область",
  "Волинська область",
  "Дніпропетровська область",
  "Донецька область",
  "Житомирська область",
  "Закарпатська область",
  "Запорізька область",
  "Івано-Франківська область",
  "Київська область",
  "Кіровоградська область",
  "Луганська область",
  "Львівська область",
  "Миколаївська область",
  "Одеська область",
  "Полтавська область",
  "Рівненська область",
  "Сумська область",
  "Тернопільська область",
  "Харківська область",
  "Херсонська область",
  "Хмельницька область",
  "Черкаська область",
  "Чернівецька область",
  "Чернігівська область"
].map(function(state, index) {
  return {name: state, index: index}
})


async.waterfall([
  function (cb) {
    console.log('Clean Areas')
    Area.removeValues(cb)
  },
  function (err, cb) {
    console.log('Clean Towers')
    Tower.removeValues(cb)
  },
  function (err, cb) {
    console.log('Clean BGPs')
    BGB.removeValues(cb)
  },
  function (err, cb) {
    console.log('Load States')
    var cur = path.resolve(__dirname, 'state.json')
    var isState = fs.existsSync(cur)
    if (isState) {
      var data = fs.readFileSync(cur)
      return cb(null, JSON.parse(data).state)
    }
    async.map(states, function(state, callback) {
      setTimeout(function() {
        googleplaces.textSearch({query: state.name, language: 'uk'},
          function (error, res) {
            var data = res.results[0] || {geometry: {}}
            callback(null, {
              name: data.name,
              viewport: data.geometry.viewport || {},
              location: data.geometry.location || {}
            })
          })
      }, 500 * state.index)
    }, cb)
  },
  function (data, cb) {
    console.log('Save States')
    var json = JSON.stringify({state: data}, null, "\t")
    fs.writeFile(path.resolve(__dirname, 'state.json'), json, 'utf8', next)
    function next() {
      cb(null, data)
    }
  },
  function (data, cb) {
    console.log('Save Areas')
    async.map(data, function(state, callback) {
      var name = state.name,
        lng = state.location.lng,
        lat = state.location.lat
      Area.addValue(name, lat, lng, function (err, res) {
        state.id = res.id
        callback(null, state)
      })
    }, cb)
  },
  function (data, cb) {
    console.log('Save Towers')
    async.map(data, function(state, callback) {
      var area = state.id,
        lng = state.location.lng,
        lat = state.location.lat
      if (!area || !lat || !lng) return next()
      var towers = []
      for (var i = 0; i < 12; i++) {
        var isMore = Math.random() - Math.random() > 0 ? 0.1 : -0.1
        towers.push({
          area: area,
          lng: lng + Math.random() * isMore * 4,
          lat: lat + Math.random() * isMore * -1 * 4,
          radius: Math.random() * 30000 + 30000
        })
      }
      async.each(towers, function (tower, back) {
        Tower.addValue(tower.area, tower.lat, tower.lng, tower.radius, function(err, res) {
          back(null)
        })
      }, next)
      function next() {
        callback(null, state)
      }
    }, cb)
  }, function(data, cb) {
      console.log('Save BGPs')
      async.map(data, function(state, callback) {
        var area = state.id,
          northeast = state.viewport.northeast,
          southwest = state.viewport.southwest

        if (!area || !northeast || !southwest) return next()
        var bgps = ['east', 'west', 'north', 'south'].reduce(function(res, item) {
          for (var i = 0; i < 2; i++) {
            res.push({
              area: area,
              lng: lng(item, i),
              lat: lat(item, i),
              radius: Math.random() * 50000 + 150000
            })
          }
          return res
        }, [])
        async.each(bgps, function (bgp, back) {
          BGB.addValue(bgp.area, bgp.lat, bgp.lng, bgp.radius, function(err, res) {
            back(null)
          })
        }, next)

        function lng(type, index) {
          var k = Math.random() - Math.random() > 0 ? 0.0001 : -0.0001
          if (type == 'east') return northeast.lng - Math.random() * 0.1 * index
          if (type == 'west') return southwest.lng + Math.random() * 0.1 * index
          if (type == 'north') return northeast.lng + Math.random() * k
          if (type == 'south') return southwest.lng + Math.random() * k
        }

        function lat(type, index) {
          var k = Math.random() - Math.random() > 0 ? 0.0001 : -0.0001
          if (type == 'east') return northeast.lat + Math.random() * k
          if (type == 'west') return southwest.lat + Math.random() * k
          if (type == 'north') return northeast.lat - Math.random() * 0.1 * index
          if (type == 'south') return southwest.lat - Math.random() * 0.1 * index
        }
        function next() {
          callback(null, state)
        }
      }, cb)
  }],
function(err, res) {
  console.log(res)
  process.exit(err ? 1 : 0)
})

