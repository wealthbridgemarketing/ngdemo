var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    del = require('del'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    minifycss = require('gulp-minify-css'),
    notify = require("gulp-notify"),
    rename = require("gulp-rename"),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify');

// define vars related to the assets folder
var srcAssetPath = 'src/assets',
    dstAssetPath = 'build/assets',
    assets = {
      img : srcAssetPath + '/images/**/*',
      scss: srcAssetPath + '/sass/**/*.scss',
      js  : srcAssetPath + '/js/**/*.js'
    },
    bower = srcAssetPath + '/bower_components';

gulp.task('asset:sass:compile', function() {
  return sass(assets.scss, { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(minifycss({keepSpecialComments : 0}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dstAssetPath + '/tmp/'))
    .pipe(notify({ message: srcAssetPath+'/sass compiled' }));
});

gulp.task('asset:build:style', ['asset:sass:compile'], function() {
  return gulp.src([bower + '/bootstrap/dist/css/bootstrap.min.css', 
            bower + '/bootstrap/dist/css/bootstrap-theme.min.css', 
            dstAssetPath + '/tmp/*.min.css'])
    .pipe(concat('style.min.css'))
    .pipe(minifycss({keepSpecialComments : 0, advanced: false, aggressiveMerging: false}))
    .pipe(gulp.dest(dstAssetPath + '/css/'))
    .pipe(notify({ message: dstAssetPath+'/styles.min.css created' }));
});

// delete the temporary files
gulp.task('asset:deltmp', ['asset:build:style'], function() {
    del([dstAssetPath + '/tmp']);
    notify({ message: dstAssetPath+'/tmp directory deleted.' });
    return;
});

// Concatenate the vendor js
gulp.task('vendorjs', function() {
  return gulp.src([bower + '/angular/angular.min.js', 
                   bower + '/angular-local-storage/dist/angular-local-storage.min.js', 
                   bower + '/angular-ui-router/release/angular-ui-router.min.js', 
                   bower + '/angular-css/angular-css.min.js', 
                   bower + '/angular-bootstrap/ui-bootstrap-tpls.min.js', 
                   bower + '/highcharts/highcharts.js', 
                   bower + '/highcharts/adapters/standalone-framework.js', 
                   bower + '/highcharts/modules/exporting.js', 
                   bower + '/highcharts/themes/dark-unica.js', 
                   bower + '/highcharts-ng/dist/highcharts-ng.min.js'])
    .pipe(concat('vendor.min.js', {newLine: ';'}))
    .pipe(gulp.dest(dstAssetPath + '/js/'))
    .pipe(notify({ message: 'vendorjs task complete' }));
});

gulp.task('default', ['asset:sass:compile', 'asset:build:style', 'asset:deltmp', 'vendorjs']);

gulp.task('log', function() {
  gutil.log('== My First Task ==');
});

gulp.task('copy', function() {
  gulp.src('index.html')
  .pipe(gulp.dest(outputDir));
});

gulp.task('sass', function() {
  gulp.src(sassSources)
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('assets'));
});

gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest(outputDir));
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(sassSources, ['sass']);
  gulp.watch(htmlSources, ['html']);
});

gulp.task('html', function() {
  gulp.src(htmlSources)
  .pipe(connect.reload())
});

gulp.task('demo', ['html', 'js', 'sass', 'watch']);