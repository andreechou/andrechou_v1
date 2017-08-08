var
gulp = require('gulp'),
sass = require('gulp-sass'),
bulkSass = require('gulp-sass-bulk-import'),
pug = require('gulp-pug'),
watch = require('gulp-watch'),
util = require('gulp-util'),
browserSync = require('browser-sync').create();

var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);


//---

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch(["sources/stylesheets/**/*.css", "sources/stylesheets/**/*.scss", "sources/stylesheets/**/*.sass"], ['sass']);
    gulp.watch('sources/pages/**/*.pug', ['pug']);
    gulp.watch("dist/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);

gulp.task('sass', function() {
  return gulp.src('sources/stylesheets/main.scss')
    .pipe(bulkSass())
    .pipe(sass({
        outputStyle: 'uncompressed',
        includePaths: ['node_modules/susy/sass']
    }).on('error', sass.logError))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('pug', function buildHTML() {
  return gulp.src(['sources/pages/**/*.pug', '!sources/pages/parts/**/*.pug'])
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('icons', function(){
  return gulp.src(['sources/icons/*.svg'])
    .pipe(iconfont({
      fontName: 'iconfont', // required 
      prependUnicode: true, // recommended option 
      formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available 
      timestamp: runTimestamp, // recommended to get consistent builds when watching files 
    }))
      .on('glyphs', function(glyphs, options) {
        // CSS templating, e.g. 
        console.log(glyphs, options);
      })
    .pipe(gulp.dest('dist/assets/fonts/'));
});