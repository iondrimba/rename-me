var gulp = require('gulp');
var bump = require('gulp-bump');

var fs = require('fs');
var semver = require('semver');

var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

// bump versions on package/bower/manifest
gulp.task('bump', function () {
  // reget package
  var pkg = getPackageJson();
  // increment version
  var newVer = semver.inc(pkg.version, 'patch');
  return gulp.src(['./package.json'])
    .pipe(bump({
      version: newVer
    }))
    .pipe(gulp.dest('./'));
});

// Run the gulp tasks
gulp.task('default', function(){
  gulp.run('bump');
});