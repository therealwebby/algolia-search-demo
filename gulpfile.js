var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var less = require('gulp-less-sourcemap');

// Static Server
gulp.task('serve', function() {
    browserSync.init({
        server: '.'
    });
});

// Watching scss/less/html files
gulp.task('watch', ['js', 'serve', 'sass', 'images'], function() {
    gulp.watch('assets/scss/**/*.scss', ['sass']);
    gulp.watch('assets/js/*.js', ['js']);
    gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('js', function () {
  return gulp.src('assets/js/main.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

// Compile SASS into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('assets/scss/*.scss')
    .pipe(sass({
      sourceComments: 'map',
      sourceMap: 'scss'
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('assets/images/*.{gif,jpg,png,svg}')
      .pipe(gulp.dest('dist/images'));
});

gulp.task('default', ['serve']);
gulp.task('server', ['serve']);
gulp.task('dev', ['watch']);
