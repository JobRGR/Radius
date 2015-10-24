var async = require('async')
var key = require('./config').key
var googleplaces = require('googleplaces')(key, 'json')

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
  function(cb) {
    async.map(states, function(state, callback) {
      setTimeout(function() {
        googleplaces.textSearch({query: state.name, language: 'uk'},
          function (error, response) {
            callback(null, response.results[0])
          })
      }, 500 * state.index)
    }, cb)
  },
  function(data, cb) {
    //TODO:Add Data to database
    cb(null, data)
  }],
function(err, res) {
  console.log(res)
})
