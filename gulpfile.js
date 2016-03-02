var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require("gulp-open"),
    webpack = require('gulp-webpack'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),  
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
          filename: 'main.min.js',
        },
      }))
      .pipe(gulp.dest('./dist/js'));
});

//Compile sass
gulp.task('compile-sass', function () {
  gulp.src('./src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

// launch browser in a port
gulp.task('open', function(){
  var options = {
    uri: 'http://localhost:' + port
  };
  gulp.src('./dist/index.html')
  .pipe(open(options));
});

// live reload server
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: port,
    livereload: true
  });
});

// live reload js
gulp.task('js', function () {
  gulp.src('./dist/**/*.js')
    .pipe(connect.reload());
});

// live reload css
gulp.task('css', function () {
  gulp.src('./dist/**/*.css')
    .pipe(connect.reload());
});

// live reload html
gulp.task('html', function () {
  gulp.src('./dist/*.html')
    .pipe(connect.reload());
});

// watch files for live reload
gulp.task('watch', function() {
    gulp.watch('src/index.html', ['copy', 'html']);
    gulp.watch('src/js/**/*.js', ['js', 'webpack']);
    gulp.watch('src/sass/**/*.scss', ['compile-sass', 'css']);
});

gulp.task('default', ['copy', 'webpack', 'compile-sass', 'connect', 'open', 'watch']);

gulp.task('serve', ['connect', 'open', 'watch']);