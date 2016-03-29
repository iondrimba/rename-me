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
        replaceReferences(this.fileNames, this.filesRenamed, this.indexFile);
        console.log('>> Complete');
    } catch (ex) {
        throw new Error('find:: ' + ex.message);
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
        console.log('>> Setup complete');
    }

    function rename(filePaths, finalOutputPaths) {
        //rename source files and move them to the destination folder
        filePaths.forEach(function(path, index) {
            var content = fs.readFileSync(path);                    
            fs.writeFileSync(finalOutputPaths[index], content);  
        }.bind(this));
        console.log('>> Rename files complete');
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

        //replace references inside the main file (index.html)
        fileNames.forEach(function(name, index) {
            var splited = name.split('.');
            var pattern = splited[0] + '[.0-9.]{1,}' + splited[1];
            var regex = new RegExp(pattern, "i");            
            contents = contents.replace(regex, newNames[index]);            
        });        
        fs.writeFileSync(indexFile, contents, 'utf8');
        console.log('>> Replace html references complete');
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

module.exports = renameMe;