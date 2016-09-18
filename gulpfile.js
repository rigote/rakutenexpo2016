var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var jsvalidate = require('gulp-jsvalidate');
var concat = require('gulp-concat');

var paths = {
    css: {
        src: [
            'node_modules/materialize-css/dist/css/materialize.css'
        ],
        dest: 'www/build/css',
        file: 'styles-1.0.0.min.css'
    },
    scripts: {
        src: [
            'app/custom/js/vendor/underscore.js',
            'app/custom/js/vendor/jquery-2.1.1.min.js',
            'app/custom/js/vendor/firebase.js',
            'node_modules/materialize-css/dist/js/materialize.js',
            'app/custom/js/funcoes.js',
            'app/custom/js/onesignal.config.js'
        ],
        dest: 'www/build/js',
        file: 'scripts-1.0.0.min.js'
    },
    fonts: {
        src: [
          'node_modules/materialize-css/fonts/roboto/**/*.+(eot|ttf|woff|woff2|svg)'
        ],
        dest: "www/build/fonts"
    }
};

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');
var tslint = require('ionic-gulp-tslint');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['images','sass', 'html', 'fonts', 'scripts', 'script', 'css'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      gulpWatch('app/**/*.png', function(){ gulp.start('images'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

gulp.task('build', ['clean'], function(done){
  runSequence(
    ['images', 'sass', 'html', 'fonts', 'scripts', 'script', 'css'],
    function(){
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});

gulp.task("images", function() {
    return gulp.src(["app/img/*"])
        .pipe(gulp.dest("www/build/img"));
});

gulp.task('css', function() {
    gulp.src(paths.css.src)
        .pipe(concat(paths.css.file))
        .pipe(cssmin())
        .pipe(gulp.dest(paths.css.dest))
});

gulp.task('script', function() {
    return gulp
        .src(paths.scripts.src)
        .pipe(jsvalidate())
        .pipe(concat(paths.scripts.file))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(paths.scripts.dest))
});

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  return del('www/build');
});
gulp.task('lint', tslint);
gulp.task('default', ['script', 'css']);