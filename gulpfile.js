/**
 * Created by FixError on 18.10.2015.
 */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: true});
var del = require('del');
var bowerFiles = require('main-bower-files');
var config = require('./gulp.config')();
var bowerSync = require('browser-sync');
var es = require('event-stream');
var beeper = require('beeper');
var colour = require('colour');
var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');

var settingsBootstrap = true;

/*===================================================================*/
/*========START LOG ERROR============================================*/
/*===================================================================*/

function onError(error) {
    beeper();
    console.log([
        '',
        '=====ERROR MESSAGE START========'.bold.red.underline,
        ("[" + error.name + " in " + error.plugin + "]").red.bold.inverse,
        error.message,
        '=====ERROR MESSAGE END========'.bold.red.underline,
        ''
    ].join('\n'));
    this.end();
}
/*===================================================================*/
/*========END LOG ERROR==============================================*/
/*===================================================================*/

/*===================================================================*/
/*========START PIPE ================================================*/
/*===================================================================*/
var pipes = {};

pipes.builtBootstapDev = function () {
    /*
     *  .bootstrap.json ===>
     *  "main": [
     *           "dist/css/bootstrap.css",
     *           "dist/js/bootstrap.js",
     *           "dist/fonts/**"
     *          ]
     *
     *          ||
     *
     *  "main": [
     *           "dist/css/bootstrap.min.css",
     *           "dist/js/bootstrap.min.js",
     *           "dist/fonts/**"
     *          ]
     */
    return gulp.src('./setting/bootstrap/.bower.json')
        .pipe(gulp.dest('./bower_components/bootstrap/'));
};

pipes.VendorScripts = function () {
    return plugins.order(['jquery.js', 'angular.js', 'angular-ui-router.js', 'bootstrap.js']);
};

pipes.validatedAppScripts = function () {
    return gulp.src(config.js.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
};

pipes.builtAppScriptsDev = function () {
    return pipes.validatedAppScripts()
        // .pipe(plugins.ngAnnotate())
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest(config.dist.scripts));
};

pipes.builtVendorScriptsStyleDev = function () {
    var filterJS = plugins.filter('**/*.js', {restore: true});
    var filterCSS = plugins.filter('**/*.css', {restore: true});
    var filterFonts = plugins.filter(
        ['**/**.otf',
            '**/**.eot',
            '**/**.svg',
            '**/**.ttf',
            '**/**.woff',
            '**/**.woff2'],
        {restore: true});
    return gulp.src(bowerFiles())
        .pipe(plugins.plumber({
                errorHandler: onError
            }
        ))
        .pipe(filterJS)
        .pipe(gulp.dest(config.dist.dev + '/bower_components/js'))
        .pipe(filterJS.restore)
        .pipe(filterCSS)
        .pipe(gulp.dest(config.dist.dev + '/bower_components/css'))
        .pipe(filterCSS.restore)
        .pipe(filterFonts)
        .pipe(gulp.dest(config.dist.dev + '/bower_components/fonts'))
        .pipe(filterFonts.restore);
};


pipes.buildAppStyleCssDev = function () {
    return gulp.src(config.css.styleCSS)
        .pipe(plugins.plumber({
                errorHandler: onError
            }
        ))
        .pipe(plugins.concat('styles.css'))
        /*.pipe(plugins.uncss({
            html: [config.clientIndex]
         }))*/
        .pipe(gulp.dest(config.dist.css));
};

pipes.processedImagesDev = function () {
    return gulp.src(config.img.imgPath)
        .pipe(gulp.dest(config.dist.img));
};

pipes.processedPartialsFilesDev = function () {
    return gulp.src(config.partialas)
        .pipe(gulp.dest(config.dist.dev));
};

pipes.builtIndexDev = function () {
    var filterJSCSS = plugins.filter(['**/*.js', '**/*.css'], {restore: true});
    var orderedVenderScripts = pipes.builtVendorScriptsStyleDev()
        .pipe(pipes.VendorScripts())
        .pipe(filterJSCSS);
    var orderedAppScriptsDev = pipes.builtAppScriptsDev();
    var orderedAppStyleDev = pipes.buildAppStyleCssDev();
    return gulp.src(config.clientIndex)
        .pipe(gulp.dest(config.dist.dev))
        .pipe(plugins.plumber({
                errorHandler: onError
            }
        ))
        .pipe(plugins.inject(orderedVenderScripts, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppScriptsDev, {relative: true}))
        .pipe(plugins.inject(orderedAppStyleDev, {relative: true}))
        .pipe(gulp.dest(config.dist.dev))
};

pipes.builtAppDev = function () {
    return es.merge(pipes.builtIndexDev(), pipes.processedImagesDev(), pipes.processedPartialsFilesDev());
};

/*===================================================================*/
/*========END PIPE ==================================================*/
/*===================================================================*/


/*===================================================================*/
/*========START DEV TASK ============================================*/
/*===================================================================*/
gulp.task('built-setting-bootstap-dev', pipes.builtBootstapDev);
gulp.task('settings', function () {
    if (settingsBootstrap) {
        return pipes.builtBootstapDev;
    }
    return;
});
gulp.task('built-vendor-dev', pipes.builtVendorScriptsStyleDev);
gulp.task('built-app-scripts-dev', pipes.builtAppScriptsDev);
gulp.task('built-app-style-dev', pipes.buildAppStyleCssDev);
gulp.task('built-img-dev', pipes.processedImagesDev);
gulp.task('built-partials-dev', pipes.processedPartialsFilesDev);
gulp.task('built-index-dev', pipes.builtIndexDev);
gulp.task('built-app-dev', pipes.builtAppDev);
gulp.task('clean-dev', function () {
    return del(config.dist.dev);
});
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);
gulp.task('deploy-dev', function() {
    return gulp.src('./dist.dev/**/*')
        .pipe(ghPages());
});
/*=======================================*/
/*========START BROWSER-SYNC DEV ========*/
/*=======================================*/

gulp.task('watch-dev', ['settings', 'clean-build-app-dev'], function () {
    var reload = bowerSync.reload;
    bowerSync({
        port: 8000,
        server: {
            baseDir: config.dist.dev
        }
    });
    //watch index
    gulp.watch(config.clientIndex, function () {
        return pipes.builtIndexDev()
            .pipe(reload({stream: true}));
    });
    //watch js
    gulp.watch(config.js.scripts, function () {
        return pipes.builtAppScriptsDev()
            .pipe(reload({stream: true}));
    });
    // watch html partials
    gulp.watch(config.partialas, function () {
        return pipes.processedPartialsFilesDev()
            .pipe(reload({stream: true}));

    });
    // watch css
    gulp.watch(config.css.styleCSS, function () {
        return pipes.buildAppStyleCssDev()
            .pipe(reload({stream: true}));
    });
});
/*=====================================*/
/*========END BROWSER-SYNC DEV ========*/
/*=====================================*/

/*===================================================================*/
/*========END DEV TASK ==============================================*/
/*===================================================================*/