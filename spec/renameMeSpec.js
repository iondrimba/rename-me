var renameMe = require('../rename-me');
var fs = require('fs');
var version = '0.0.' + new Date().getSeconds();
var del = require('del');


describe('RenameMe Tests', function() {

    function getJSSingleFileParameters() {
        var options = {};
        options.version = version;
        options.indexFile = './public/index.html';
        options.filePath = ['./public/js/app.js'];
        options.outputfolder = ['./public/js/'];
        return options;
    }

    function getCSSingleFileParameters() {
        var options = {};
        options.version = version;
        options.indexFile = './public/index.html';
        options.filePath = ['./public/css/app.css'];
        options.outputfolder = ['./public/css/'];
        return options;
    }

    function getMultipleFileParameters() {
        var options = {};
        options.version = version;
        options.indexFile = './public/index.html';
        options.filePath = ['./public/js/app.js', './public/css/app.css'];
        options.outputfolder = ['./public/js/', './public/css/'];
        return options;
    }

    beforeEach(function() {
        var js = fs.readFileSync('src/app.js');
        fs.writeFileSync('public/js/app.js', js, 'utf8');

        var css = fs.readFileSync('src/app.css');
        fs.writeFileSync('public/css/app.css', css, 'utf8');
    });

    afterEach(function() {
        del.sync(['public/js/**', '!public', '!public/js']);
        del.sync(['public/css/**', '!public', '!public/css']);
    });

    it('Lib should be defined ', function() {
        expect(renameMe).toBeDefined();
    });


    it('Should create CSS file with version tag ' + version, function() {
        var result = false;
        var options = getCSSingleFileParameters();

        renameMe(options);

        var bumpedFile = './public/css/app.' + version + '.css';
        var content = fs.readFileSync(bumpedFile, 'utf8');
        result = (content.length > 0);
        expect(result).toBe(true);
    });

    it('Should create JS file with version tag ' + version, function() {
        var result = false;
        var options = getJSSingleFileParameters();

        renameMe(options);

        var bumpedFile = './public/js/app.' + version + '.js';
        var content = fs.readFileSync(bumpedFile, 'utf8');
        result = (content.length > 0);
        expect(result).toBe(true);
    });


    it('Should change the reference of CSS path with version ' + version + ' inside the html file', function() {
        var result = false;
        var options = getCSSingleFileParameters();

        renameMe(options);

        var content = fs.readFileSync(options.indexFile, 'utf8');
        result = (content.indexOf('app.' + version + '.css') > -1);
        expect(result).toBe(true);
    });

    it('Should change the reference of JS path with version ' + version + ' inside the html file', function() {
        var result = false;
        var options = getJSSingleFileParameters();

        renameMe(options);

        var content = fs.readFileSync(options.indexFile, 'utf8');
        result = (content.indexOf('app.' + version + '.js') > -1);
        expect(result).toBe(true);
    });

    it('Should create both JS and CSS files with version tag ' + version, function() {
        var resultCSS = false;
        var resultJS = false;
        var options = getMultipleFileParameters();

        renameMe(options);

        var bumpedFileCSS = './public/css/app.' + version + '.css';
        content = fs.readFileSync(bumpedFileCSS, 'utf8');
        resultCSS = (content.length > 0);

        var bumpedFileJS = './public/js/app.' + version + '.js';
        content = fs.readFileSync(bumpedFileJS, 'utf8');
        resultJS = (content.length > 0);

        expect(resultCSS).toBe(true);
        expect(resultJS).toBe(true);
    });

    it('Should throw exception', function() {
        expect(function() {
            var result = false;
            var options = {};

            renameMe(options);

        }).toThrow();
    });


    it('Should change the reference of both JS and CSS with version tag ' + version + ' inside the html file', function() {
        var resultJS = false;
        var resultCSS = false;
        var options = getMultipleFileParameters();

        renameMe(options);

        var content = fs.readFileSync(options.indexFile, 'utf8');
        resultJS = (content.indexOf('app.' + version + '.js') > -1);

        content = fs.readFileSync(options.indexFile, 'utf8');
        resultCSS = (content.indexOf('app.' + version + '.css') > -1);

        expect(resultCSS).toBe(true);
        expect(resultJS).toBe(true);
    });
});