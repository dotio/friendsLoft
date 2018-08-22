// check mistakes

'use strict';

module.exports = function() {
    $.gulp.task('js:lint', function() {
        return $.gulp.src($.path.app)
            .pipe($.gp.eslint({
                globals: [
                    'VK',
                    'jQuery',
                    '$'
                ],
                envs: [
                    'browser',
                    'es6'
                ]
            }))
            .pipe($.gp.eslint.format());
    })
};
