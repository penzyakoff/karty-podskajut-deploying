const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function html() {
  return gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function css() {
  return gulp.src('src/blocks/styles/**/*.css') // updated to specify styles folder
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest('dist/styles')) // updated to place in styles subfolder
        .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/blocks/images/*.{jpg,png,svg,gif,ico,webp,avif}')
    .pipe(plumber())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}


function scripts() {
  return gulp.src('src/blocks/scripts/**/*.js')
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/styles/**/*.css'], css); // updated to specify styles folder
  gulp.watch(['src/blocks/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/blocks/scripts/**/*.js'], scripts);
}

const build = gulp.series(clean, gulp.parallel(html, css, images, scripts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.images = images;
exports.scripts = scripts;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
