'use-strict';
//node >  rename-me file version outputpath index.html
//demo > node rename-me src/app.js 1.1.1 public/ public/index.html
//output > public/app.1.1.1.js

var fs = require('fs');
var filePath = process.argv[2]; //SOURCE FILE PATH ex: Desktop/excel.xlsx;
var version = process.argv[3]; //OUTPUT PATH ex: 1.2.3 - could be anything'
var outputfolder = process.argv[4]; //OUTPUT PATH ex: Desktop/'
var indexFile = process.argv[5]; //INDEX FILE TO REPLACE REFERNCES OF OLD FILE'

var fileName = [],
    fileExtension = '',
    tempNameNoExtension = '',
    fileRenamed = '',
    finalOutputPath = [];


var renameMe = function(options) {

    filePath = options.filePath;
    version = options.version;
    outputfolder = options.outputfolder;
    indexFile = options.indexFile;

    try {
        setup();
        rename();
        replaceReferences(fileRenamed);
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

        outputfolder.forEach(function(folder, index) {
            finalOutputPath.push(folder + fileRenamed[index]);
        });
    }


    function rename() {
        filePath.forEach(function(path, index) {
            fs.createReadStream(path)
                .pipe(fs.createWriteStream(finalOutputPath[index]));
        });
    };

    function removePathFromFileName(files) {
        var output = [];
        files.forEach(function(name) {
            var filename = name.replace(/.+([^\/])\//g, '');
            //src/js/hello.js -> hello.js
            output.push(filename);
        });
        return output;
    };

    function getFileExtension(files) {
        var output = [];
        files.forEach(function(name) {
            var filename = name.replace(/[0-9a-z-0-1]{1,}/, '');

            //hello.js -> .js
            output.push(filename);
        });
        return output;
    };

    function getFileNameWithoutExtension(files) {
        var output = [];
        files.forEach(function(name) {
            var filename = name.replace(/[0-9a-z]+$/, '');

            // hello.js -> hello.
            output.push(filename);
        });
        return output;
    };

    function replaceReferences(newNames) {
        var contents = fs.readFileSync(indexFile, 'utf8');
        var regex = new RegExp(fileName, "g");

        fs.readFile(indexFile, 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }
            fileName.forEach(function(name, index) {
                regex = new RegExp(name, "g");
                contents = contents.replace(regex, newNames[index]);              
            });

            fs.writeFile(indexFile, contents, 'utf8', function(err) {
                if (err) return console.log(err);
            });
        });
    };

    function concatNamedVersion(options) {
        var output = [];
        options.name.forEach(function(name, index) {
            var filename = name.replace(/[0-9a-z]+$/, '');

            // hello.js -> hello.version.js            
            output.push(options.name[index] + options.version + options.extension[index]);
        });
        return output;
    };
}

//execute if called manually via terminal
if (process.argv.length > 3) {
    var options = {};    
    options.filePath = filePath.split(',');;
    options.version = version;
    options.outputfolder = outputfolder.split(',');;
    options.indexFile = indexFile;
    renameMe(options);
}

module.exports = renameMe;