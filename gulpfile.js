'use strict';

global.$ = {
    package: require('./package.json'),
    config: require('./gulp/config'),
    merge: require('merge-stream'),
    path: {
        tasks: require('./gulp/paths/tasks.js'),
        jsVendor: require('./gulp/paths/js.vendor.js'),
        cssVendor: require('./gulp/paths/css.vendor.js'),
        app: require('./gulp/paths/app.js')
    },
    gulp: require('gulp'),
    del: require('del'),
    browserSync: require('browser-sync').create(),
    gp: require('gulp-load-plugins')()
};

$.path.tasks.forEach(function(taskPath) {
    require(taskPath)();
});

$.gulp.task('default', $.gulp.series(
    'clean',
    'sprite:svg',
    $.gulp.parallel(
        'sass',
        'pug',
        'js:vendor',
        // 'css:vendor',
        'js:process',
        'copy:image',
        'fonts'
    ),
    $.gulp.parallel(
        'watch',
        'serve'
    )
));
