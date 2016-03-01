var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require("gulp-open"),
    webpack = require('gulp-webpack'),
    concat = require('gulp-concat'),    
    port = process.env.port || 3031;

//copy static files to dist
gulp.task('copy', function(){
  gulp.src('./src/index.html')
      .pipe(gulp.dest('./dist/'));
});

//webpack the js
gulp.task('webpack', function() {
  gulp.src('./src/js/main.js')
      .pipe(webpack({
        output: {
          filename: 'main.js',
        },
      }))
      .pipe(gulp.dest('./dist/js'));
});

// launch browser in a port
gulp.task('open', function(){
  var options = {
    url: 'http://localhost:' + port
  };
  gulp.src('./dist/index.html')
  .pipe(open('', options));
});

// live reload server
gulp.task('connect', function() {
  connect.server({
    root: 'src',
    port: port,
    livereload: true
  });
});

// live reload js
gulp.task('js', function () {
  gulp.src('./dist/**/*.js')
    .pipe(connect.reload());
});

// live reload html
gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

// watch files for live reload
gulp.task('watch', function() {
    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/js/**/*.js', ['webpack']);
});

gulp.task('default', ['copy', 'webpack']);

gulp.task('serve', ['connect', 'open', 'watch']);