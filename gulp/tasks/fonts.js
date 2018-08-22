// copy fonts

'use strict';

module.exports = function () {
    $.gulp.task('fonts', function () {
        return $.gulp.src('./src/fonts/**/*.*', { since: $.gulp.lastRun('fonts') })
            .pipe($.gp.fontmin())
            .pipe($.gulp.dest($.config.root + '/fonts/'));
    });
};
