var express = require('express')
var bodyParser =  require('body-parser')
var morgan = require('morgan')
var app = module.exports.app = exports.app = express()
var port = process.env.PORT || 3333
var routes = require('./routes')

app.use(require('connect-livereload')())

app.set('views', __dirname + '/../../dist')
app.use(express.static(__dirname + '/../../dist'))

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(bodyParser.json({limit: '50mb'}))

if(app.get('env') == 'development'){
  app.use(morgan('dev'))
} else {
  app.use(morgan('default'))
}

app.use(routes())

app.listen(port)
console.log('[server]:', port)
