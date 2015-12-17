var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var jade = require('gulp-jade');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var spritesmith = require('gulp.spritesmith');



gulp.task('copyfonts', function() {
   gulp.src('./fonts/**/*')
   .pipe(gulp.dest('dist/fonts'));
});

gulp.task('useref', function(){
  return gulp.src('./*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', minifyCSS()))
        .pipe(gulp.dest('dist'));
});


gulp.task('sprite', function () {
  var spriteData = gulp.src('img/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss'
  }));
  return spriteData.pipe(gulp.dest('img/sprite/'));
});

gulp.task('images', function(){
  return gulp.src('./img/**/*.+(png|jpg|gif|svg)')
   .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/img'))
});




gulp.task('watch', ['sass'], function(gulpCallback) {
  browserSync.init({
    // serve out of app/
    server: './',
    // launch default browser as soon as server is up
    open: true,
    index: "index.html"
  }, function callback() {
    // (server is now up)

    gulp.watch(["*.jade","./jade/**/*.jade"], ['jade']);

    // watch html and reload browsers when it changes
    gulp.watch('index.html', browserSync.reload);

    // when sass files change run specified gulp task
    gulp.watch('./sass/**/*.scss', ['sass']);

    gulp.watch("./js/*.js", browserSync.reload);

    gulp.watch("./img/*.*", browserSync.reload);

    // notify gulp that this task is done
    gulpCallback();
  });
});


gulp.task('jade', function() {
  gulp.src('./*.jade')
  	.on('error', function(err){ console.log(err.message); })
    .pipe(jade({
      pretty:true
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('sass', function() {
  return gulp.src('./sass/**/*.scss*')
    .pipe(sass())
    .pipe(gulp.dest('css/'))
    // if BrowserSync's static server isn't running this stream is a no-op passthrough
    .pipe(browserSync.stream());
});


gulp.task('default', ['watch']);
