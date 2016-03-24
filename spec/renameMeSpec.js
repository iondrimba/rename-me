var renameMe = require('../rename-me');
var fs = require('fs');
var version = '0.0.1';

describe('RenameMe Tests', function() {

	it('Lib should be defined ', function() {
		expect(renameMe).toBeDefined();
	});

	it('Should rename JS file with version tag ' + version, function() {
		var result = false;
		var options = {};
		options.version = version;
		options.indexFile = './public/index.html';
		options.filePath = ['./public/js/app.js', './public/css/app.css'];
		options.outputfolder = ['./public/js/', './public/css/'];

		renameMe(options);

		var bumpedFile = './public/js/app.' + version + '.js';
		var data = fs.readFile(bumpedFile, 'utf8', function() {
			if (err) throw err;
			result = true;
			console.log('js done');

			asyncSpecDone();
		});

		expect(result).toBe(true);
		asyncSpecWait();
	});

	it('Should rename CSS file with version tag ' + version, function() {
		var result = false;
		var options = {};
		options.version = version;
		options.indexFile = './public/index.html';
		options.filePath = ['./public/js/app.js', './public/css/app.css'];
		options.outputfolder = ['./public/js/', './public/css/'];

		renameMe(options);

		var bumpedFile = './public/css/app.' + version + '.css';
		var data = fs.readFile(bumpedFile, 'utf8', function() {
			if (err) throw err;
			result = true;
			console.log('css done');
			asyncSpecDone();
		});

		expect(result).toBe(true);
		asyncSpecWait();

	});

});