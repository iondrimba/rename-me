'use-strict';
//node >  rename-me file version outputpath index.html
//demo > node rename-me src/app.js 1.1.1 public/js public/index.html
//output > public/app.1.1.1.js

var fs = require('fs');
var filePath = process.argv[2]; //SOURCE FILE PATH ex: Desktop/excel.xlsx;
var version = process.argv[3]; //OUTPUT PATH ex: 1.2.3 - could be anything'
var outputfolder = process.argv[4]; //OUTPUT PATH ex: Desktop/'
var indexFile = process.argv[5]; //INDEX FILE TO REPLACE REFERNCES OF OLD FILE'

var fileNames = [],
    fileExtensions = [],
    tempNameNoExtension = [],
    filesRenamed = [],
    finalOutputPaths = [];

var renameMe = function (options) {

    filePath = options.filePath;
    version = options.version;
    outputfolder = options.outputfolder;
    indexFile = options.indexFile;

    try {
        setup();
        rename();
        replaceReferences(filesRenamed);
    } catch (ex) {
        console.log('ex:', ex.message);
    }

    function setup() {
        fileNames = removePathFromFileName(filePath);
        fileExtensions = getFileExtension(fileNames);
        tempNameNoExtension = getFileNameWithoutExtension(fileNames);

        filesRenamed = concatNamedVersion({
            name: tempNameNoExtension,
            version: version,
            extension: fileExtensions
        });

        outputfolder.forEach(function (folder, index) {
            finalOutputPaths.push(folder + filesRenamed[index]);
        });
    }


    function rename() {
        //rename source files and move them to the destination folder
        filePath.forEach(function (path, index) {
            fs.createReadStream(path)
                .pipe(fs.createWriteStream(finalOutputPaths[index]));
        });
    };

    function removePathFromFileName(files) {
        var output = [];
        files.forEach(function (name) {
            var filename = name.replace(/.+([^\/])\//g, '');
            //src/js/hello.js -> hello.js
            output.push(filename);
        });
        return output;
    };

    function getFileExtension(files) {
        var output = [];
        files.forEach(function (name) {
            var filename = name.replace(/[0-9a-z-0-1]{1,}/, '');

            //hello.js -> .js
            output.push(filename);
        });
        return output;
    };

    function getFileNameWithoutExtension(files) {
        var output = [];
        files.forEach(function (name) {
            var filename = name.replace(/[0-9a-z]+$/, '');

            // hello.js -> hello.
            output.push(filename);
        });
        return output;
    };

    function replaceReferences(newNames) {
        var contents = fs.readFileSync(indexFile, 'utf8');
        var regex = new RegExp(fileNames, "g");

        //read the main file (index.html)
        fs.readFile(indexFile, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            //replace references inside the main file (index.html)
            fileNames.forEach(function (name, index) {
                regex = new RegExp(name, "g");
                contents = contents.replace(regex, newNames[index]);
            });

            //write the main file (index.html) with the new references
            fs.writeFile(indexFile, contents, 'utf8', function (err) {
                if (err) return console.log(err);
            });
        });
    };

    function concatNamedVersion(options) {
        var output = [];
        options.name.forEach(function (name, index) {
            var filename = name.replace(/[0-9a-z]+$/, '');

            // hello.js -> hello.version.js (hello.1.2.0.js)
            output.push(options.name[index] + options.version + options.extension[index]);
        });
        return output;
    };
}

//executed if called manually via terminal
if (process.argv.length > 3) {
    var options = {};
    options.filePath = filePath.split(',');;
    options.version = version;
    options.outputfolder = outputfolder.split(',');;
    options.indexFile = indexFile;
    renameMe(options);
}

module.exports = renameMe;