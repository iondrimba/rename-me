# rename-me
Rename files with version tag to optimize cache


####GOAL

1. Avoid caching build files when they are modified.
2. Avoid cache invalidation via query string ie: path/file.js?hash=#####
3. Rename a file based on a version suplied as parameter and change its reference inside the html file.

####INSTALL

```sh
 npm install rename-me --save-dev
```
####TODO

* Write tests
* Develop a Gulp plugin for easy integration

####TARGET PROJECT
This package is meant to be used with Single Page Applications

####Usage via terminal

Inside the terminal type:

* keep the end / on the destination folder

```sh
 node rename-me file-path-to-rename.js version-number destination/ index.html
```

#####Real world:

```sh
 node .node_modules/rename-me/rename-me public/js/app.js 1.0.1 public/js/ public/index.html
```

#####Multiple files

* multiple parameters are passed inside quotes and comma separeted 'param1', 'param2'

```sh
 node .node_modules/rename-me/rename-me 'public/js/app.js','public/css/app.css' 1.0.1 'public/js/','public/css/' public/index.html
```

####Using with Gulp (workaround)

Install these dependencies
```sh
npm install gulp-bump --save-dev
npm install semver --save-dev
npm install rename-me --save-dev
```
Inside your gulpfile load them
```js
var bump = require('gulp-bump');
var semver = require('semver');
var renameMe = require('rename-me');
```
Read the package.json file and store it as an object
```js
var pckg = require('./package.json');
```
Bump the package.json version tag using semver lib
```js
var patch = semver.inc(pckg.version, 'patch');
var minor = semver.inc(pckg.version, 'minor');
var major = semver.inc(pckg.version, 'major');
```
Define a function to bump the package.json version tag so we can use it
```js
function bumpPackageJson(type) {
	return gulp.src(['./package.json'])
		.pipe(bump({
			version: type
		}))
		.pipe(gulp.dest('./'));
}
```
Define the bump version tasks using bumpPackageJson
```js
//PATCH
gulp.task('patch', function () {
	return bumpPackageJson(patch);
});

//MINOR
gulp.task('minor', function () {
	return bumpPackageJson(minor);
});

//MAJOR
gulp.task('major', function () {
	return bumpPackageJson(major);
});
```
Define the function that will receive the bumped version tag and update the files
```js
function bumpAppFiles(version) {
	var options = {};
	options.version = version;
	options.indexFile = './public/index.html';

	options.filePath = ['./public/js/app.js', './public/css/app.css'];
	options.outputfolder = ['./public/js/', './public/css/'];

	renameMe(options);
}
```
Define the final task for each bump version type 
```js
gulp.task('bump-patch', ['patch'], function renamePatch() {
	bumpAppFiles(patch);
});

gulp.task('bump-minor', ['minor'], function renameMinor() {
	bumpAppFiles(minor);
});

gulp.task('bump-major', ['major'], function renameMajor() {
	bumpAppFiles(major);
});
```

Finally you should run the rename task manually as the last task, do not chain it with other tasks.
```js
npm gulp bump-patch
```
