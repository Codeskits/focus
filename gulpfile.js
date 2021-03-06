/**
 * gulp modules
 */
const gulp = require('gulp');
const buble = require('gulp-buble');
const rollup = require('gulp-rollup');
const stylus = require('gulp-stylus');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

/**
 * browser Sync
 */
const browserSync = require('browser-sync');
const reload = browserSync.reload;


/**
 * Scripts task
 */
gulp.task('scripts', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(plumber())
        .pipe(rollup({
            rollup: require('rollup'),
            entry: './src/js/focus.js',
            format: 'umd',
            moduleName: 'Focus'
        }))
        .pipe(buble())
        .pipe(rename({
            basename: "focus",
            suffix: "",
            extname: ".js"
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(reload({stream: true}));
});

/**
 * Styles task
 */
gulp.task('styles', function () {
    gulp.src('./src/stylus/app.styl')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(rename({
            basename: "focus",
            suffix: "",
            extname: ".css"
        }))
        .pipe(autoprefixer('last 5 version'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({stream: true}));
});

/**
 * Production scripts task
 */
gulp.task('production:scripts', () => {
    gulp.src('./src/**/*.js')
        .pipe(rollup({
            rollup: require('rollup'),
            entry: './src/js/focus.js',
            format: 'umd',
            moduleName: 'Focus'
        }))
        .pipe(buble())
        .pipe(rename({
            basename: "focus",
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

/**
 * production styles task
 */
 gulp.task('production:styles', () => {
    gulp.src('./src/stylus/app.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(rename({
            basename: "focus",
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(gulp.dest('./dist/css'));
     })

/**
 * production  task
 */
 gulp.task('production', ['styles', 'scripts', 'production:scripts', 'production:styles']);

 /**
  * Browser-sync task
  */
gulp.task('browser-sync', function () {
    browserSync.init({
       proxy: "focus.dev/index.html"
   });
})

/**
 * Watch task
 */
gulp.task('watch', function () {
    gulp.watch('./src/js/**/*.js', ['scripts']);
    gulp.watch('./src/stylus/**/*.styl', ['styles']);
    gulp.watch('./**/*.html', function () {
        gulp.src('./**/*.html').pipe(reload({stream: true}));
    });
});

/**
 * Default task
 */
gulp.task('default', ['styles', 'browser-sync', 'watch']);
