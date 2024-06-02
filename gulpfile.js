const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mediaquery = require('postcss-combine-media-query');
const cssnano = require('cssnano');
const htmlMinify = require('html-minifier');


function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function html() {

  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true
  };

  return gulp.src('src/**/*.html')
        .pipe(plumber())
        .on('data', function(file) {
          const buferFile = Buffer.from(htmlMinify.minify(file.contents.toString(), options))
          return file.contents = buferFile
        })
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({stream: true}));
}

function css() {

  const plugins = [
    autoprefixer({ overrideBrowserslist: ['last 5 versions'], grid: true }),
    mediaquery(),
    cssnano()
  ];

  return gulp.src('src/blocks/styles/**/*.css') 
        .pipe(plumber())
        .pipe(concat('bundle.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({stream: true}))
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
