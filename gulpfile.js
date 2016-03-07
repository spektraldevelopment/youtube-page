var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require("gulp-open"),
    webpack = require('gulp-webpack'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),  
    port = process.env.port || 3031,
    config = {
      srcDir : 'src',
      distDir : 'dist'
    };

//copy static files to dist
gulp.task('copy', function(){
  gulp.src('./' + config.srcDir + '/index.html')
      .pipe(gulp.dest('./' + config.distDir + '/'));
});

//webpack the js
gulp.task('webpack', function() {
  gulp.src('./' + config.srcDir + '/js/main.js')
      .pipe(webpack({
        output: {
          filename: 'main.min.js',
        },
      }))
      .pipe(gulp.dest('./' + config.distDir + '/js'));
});

//Compile sass
gulp.task('compile-sass', function () {
  gulp.src('./' + config.srcDir + '/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./' + config.distDir + '/css'));
});

// launch browser in a port
gulp.task('open', function(){
  var options = {
    uri: 'http://localhost:' + port
  };
  gulp.src('./' + config.distDir + '/index.html')
  .pipe(open(options));
});

// live reload server
gulp.task('connect', function() {
  connect.server({
    root: config.distDir,
    port: port,
    livereload: true
  });
});

// live reload js
gulp.task('js', function () {
  gulp.src('./' + config.distDir + '/**/*.js')
    .pipe(connect.reload());
});

// live reload css
gulp.task('css', function () {
  gulp.src('./' + config.distDir + '/**/*.css')
    .pipe(connect.reload());
});

// live reload html
gulp.task('html', function () {
  gulp.src('./' + config.distDir + '/*.html')
    .pipe(connect.reload());
});

// watch files for live reload
gulp.task('watch', function() {
    gulp.watch(config.srcDir + '/index.html', ['copy', 'html']);
    gulp.watch(config.srcDir + '/js/**/*.js', ['js', 'webpack']);
    gulp.watch(config.srcDir + '/sass/**/*.scss', ['compile-sass', 'css']);
});

gulp.task('default', ['copy', 'webpack', 'compile-sass', 'connect', 'open', 'watch']);

gulp.task('serve', ['connect', 'open', 'watch']);