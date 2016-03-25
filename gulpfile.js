var gulp = require('gulp');
var bump = require('gulp-bump');

var fs = require('fs');
var semver = require('semver');
var pckg = require('./package.json');
var coveralls = require('gulp-coveralls');

function bumpVersion(type) {
	var newVer = semver.inc(pckg.version, type);
	return gulp.src(['./package.json'])
		.pipe(bump({
			version: newVer
		}))
		.pipe(gulp.dest('./'));
}

gulp.task('bump-patch', function () {
	return bumpVersion('patch');
});
gulp.task('bump-minor', function () {
	return bumpVersion('minor');
});
gulp.task('bump-major', function () {
	return bumpVersion('major');
});

gulp.task('default', function () {
	gulp.run('bump-patch');
});

gulp.task('coveralls', function () {
    gulp.src('./coverage/lcov.info')
        .pipe(coveralls());
});
