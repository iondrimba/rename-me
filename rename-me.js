'use-strict';
//node >  rename-me file version outputpath index.html
//demo > node rename-me src/app.js 1.1.1 public/js public/index.html
//output > public/app.1.1.1.js
var fs = require('fs'); 

var renameMe = function(options) {
    
    this.filePaths = options.filePath;
    this.version = options.version;
    this.outputfolder = options.outputfolder;
    this.indexFile = options.indexFile;

    this.fileNames = [];
    this.fileExtensions = [];
    this.tempNameNoExtension = [];
    this.filesRenamed = [];
    this.finalOutputPaths = [];    

    try {
        setup();
        rename(this.filePaths, this.finalOutputPaths);
        replaceReferences(this.fileNames,this.filesRenamed, this.indexFile);
    } catch (ex) {
        console.log('ex:', ex.message);
    }

    function setup() {
        this.fileNames = removePathFromFileName(this.filePaths);
        this.fileExtensions = getFileExtension(this.fileNames);
        this.tempNameNoExtension = getFileNameWithoutExtension(this.fileNames);

        this.filesRenamed = concatNamedVersion({
            name: this.tempNameNoExtension,
            version: this.version,
            extension: this.fileExtensions
        });

        this.outputfolder.forEach(function(folder, index) {
            this.finalOutputPaths.push(folder + this.filesRenamed[index]);
        }.bind(this));
    }

    function rename(filePaths, finalOutputPaths) {
        //rename source files and move them to the destination folder
        filePaths.forEach(function(path, index) {
            var content = fs.readFileSync(path);                    
            fs.writeFileSync(finalOutputPaths[index], content);  
        }.bind(this));
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

    function replaceReferences(fileNames, newNames, indexFile) {
        var contents = fs.readFileSync(indexFile, 'utf8');
        var regex = new RegExp(fileNames, "g");                    
        //replace references inside the main file (index.html)
        fileNames.forEach(function(name, index) {
            regex = new RegExp(name, "g");           
            contents = contents.replace(regex, newNames[index]);
        });        
        fs.writeFileSync(indexFile, contents, 'utf8');       
    };

    function concatNamedVersion(options) {
        var output = [];
        options.name.forEach(function(name, index) {
            var filename = name.replace(/[0-9a-z]+$/, '');

            // hello.js -> hello.version.js (hello.1.2.0.js)
            output.push(options.name[index] + options.version + options.extension[index]);
        });
        return output;
    };
}

//executed if called manually via terminal
if (process.argv.length > 3) {

    var fs = require('fs');
    var filePath = process.argv[2]; //SOURCE FILE PATH ex: Desktop/excel.xlsx;
    var version = process.argv[3]; //OUTPUT PATH ex: 1.2.3 - could be anything'
    var outputfolder = process.argv[4]; //OUTPUT PATH ex: Desktop/'
    var indexFile = process.argv[5]; //INDEX FILE TO REPLACE REFERNCES OF OLD FILE'


    var options = {};
    options.filePath = filePath.split(',');;
    options.version = version;
    options.outputfolder = outputfolder.split(',');;
    options.indexFile = indexFile;
    renameMe(options);
}

module.exports = renameMe;