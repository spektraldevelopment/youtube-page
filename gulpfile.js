var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require("gulp-open"),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    port = process.env.port || 3031;

gulp.task('browserify', function() {
  gulp.src('./src/js/components/main.js')
      .pipe(browserify({ transform: 'reactify' }))
      .pipe(gulp.dest('./dist/js'));
});

// launch browser in a port
gulp.task('open', function(){
  var options = {
    url: 'http://localhost:' + port
  };
  gulp.src('./src/index.html')
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
// gulp.task('js', function () {
//   gulp.src('./app/dist/**/*.js')
//     .pipe(connect.reload());
// });

// live reload html
gulp.task('html', function () {
  gulp.src('./*.html')
    .pipe(connect.reload());
});

// watch files for live reload
gulp.task('watch', function() {
    //gulp.watch('app/dist/js/*.js', ['js']);
    gulp.watch('src/index.html', ['html']);
    gulp.watch('src/js/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify']);

gulp.task('serve', ['connect', 'open', 'watch']);