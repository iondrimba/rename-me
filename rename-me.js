'use-strict';
//node >  rename-me file version outputpath
//demo > node rename-me src/app.js 1.1.1 public/
//output > public/app.1.1.1.js

var fs = require('fs');
var filePath = process.argv[2]; //SOURCE FILE PATH ex: Desktop/excel.xlsx;
var version = process.argv[3]; //OUTPUT PATH ex: 1.2.3 - could be anything'
var outputfolder = process.argv[4]; //OUTPUT PATH ex: Desktop/'
var indexFile = process.argv[5]; //OUTPUT PATH ex: Desktop/'

var fileName = '',
    fileExtension = '',
    tempNameNoExtension = '',
    fileRenamed = '',
    finalOutputPath = '';


var renameMe = function (options) {

    filePath = options.filePath;
    version = options.version;
    outputfolder = options.outputfolder;
    indexFile = options.indexFile;

    try {
        setup();
        rename();
        replaceReferences(fileRenamed);
        fs.stat(finalOutputPath, (err, stats) => {
            if (err) throw err;
            console.log('sucess:', `stats: ${JSON.stringify(stats)}`);
        });
    } catch (ex) {
        console.log('ex:', ex.message);
    }

    function setup() {
        fileName = removePathFromFileName(filePath);
        fileExtension = getFileExtension(fileName);
        tempNameNoExtension = getFileNameWithoutExtension(fileName);
        fileRenamed = concatNamedVersion({
            name: tempNameNoExtension,
            version: version,
            extension: fileExtension
        });
        finalOutputPath = outputfolder + fileRenamed;
    }


    function rename() {

        fs.createReadStream(filePath)
            .pipe(fs.createWriteStream(finalOutputPath));
    };

    function removePathFromFileName(input) {
        var output = input;

        //src/js/hello.js -> hello.js
        output = input.replace(/.+([^\/])\//g, '');

        return output;
    };

    function getFileExtension(input) {
        var output = input;

        //hello.js -> .js
        output = input.replace(/[0-9a-z-0-1]{1,}/, '');

        return output;
    };

    function getFileNameWithoutExtension(input) {
        var output = input;

        // hello.js -> hello.
        output = input.replace(/[0-9a-z]+$/, '');

        return output;
    };

    function replaceReferences(newName) {
        var contents = fs.readFileSync(indexFile, 'utf8');
        var regex = new RegExp(fileName, "g");
        var output = '';

        fs.readFile(indexFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }
            output = contents.replace(regex, newName);
            fs.writeFile(indexFile, output, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    };

    function concatNamedVersion(options) {
        var output = '';

        output = options.name + options.version + options.extension;

        return output;
    };
}

//execute if called manually via terminal
if (process.argv[4]) {
    var options = {};
    options.filePath = filePath;
    options.version = version;
    options.outputfolder = outputfolder;
    options.indexFile = indexFile;
    renameMe(options);
}

module.exports = renameMe;