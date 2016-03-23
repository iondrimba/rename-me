var gulp = require('gulp');
var bump = require('gulp-bump');

var fs = require('fs');
var semver = require('semver');
var pckg = require('./package.json');


gulp.task('bump', function() {
    var newVer = semver.inc(pckg.version, 'patch');
    return gulp.src(['./package.json'])
        .pipe(bump({
            version: newVer
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('default', function() {
    gulp.run('bump');
});