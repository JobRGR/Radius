var gulp = require('gulp')
var path = require('path')
var $ = require('gulp-load-plugins')()
var minifyCSS = require('gulp-minify-css')
var concat = require('gulp-concat')
var del = require('del')
var environment = $.util.env.type || 'development'
var isProduction = environment === 'production'
var webpackConfig = require('./webpack.config.js').getConfig(environment)

var port = $.util.env.port || 1337
var app = 'app/'
var dist = 'dist/'

var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
]

gulp.task('scripts', function() {
  return gulp.src(webpackConfig.entry)
    .pipe($.webpack(webpackConfig))
    .pipe(isProduction ? $.uglifyjs() : $.util.noop())
    .pipe(gulp.dest(dist + 'js/'))
    .pipe($.size({ title : 'js' }))
    .pipe($.connect.reload());
})

gulp.task('html', function() {
  return gulp.src(app + 'index.html')
    .pipe(gulp.dest(dist))
    .pipe($.size({ title : 'html' }))
    .pipe($.connect.reload())
})

gulp.task('styles',function(cb) {
  return gulp.src(app + '/**/*.styl')
    .pipe($.stylus({
      compress: isProduction,
      'include css' : true
    }))
    .pipe(minifyCSS())
    .pipe(concat('bundle.css'))
    .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
    .pipe(gulp.dest(dist + 'css/'))
    .pipe($.size({ title : 'css' }))
    .pipe($.connect.reload())
})

gulp.task('serve', function() {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35729
    }
  })
})

gulp.task('images', function(cb) {
  return gulp.src(app + '**/*.{png,jpg,jpeg,gif}')
    .pipe($.size({ title : 'images' }))
    .pipe(gulp.dest(dist + 'images/'))
})

gulp.task('watch', function() {
  gulp.watch(app + '/**/*.styl', ['styles'])
  gulp.watch(app + 'index.html', ['html'])
  gulp.watch(app + '**/*.js', ['scripts'])
  gulp.watch(app + '**/*.jsx', ['scripts'])
});

gulp.task('clean', function(cb) {
  del([dist], cb)
})


gulp.task('default', ['build', 'serve', 'watch'])

gulp.task('build', ['clean'], function(){
  gulp.start(['images', 'html','scripts','styles'])
})
