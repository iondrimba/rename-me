//node >  rename file version outputpath
//demo > node rename src/app.js public/

var fs = require('fs');
var filePath = process.argv[2]; //SOURCE FILE PATH ex: Desktop/excel.xlsx;
var version = process.argv[3]; //OUTPUT PATH ex: 1.2.3 - could be anything'
var outputfolder = process.argv[4]; //OUTPUT PATH ex: Desktop/'

// fs.rename('./teste.js', './teste-renamed.js', (err) => {
//     if (err) throw err;
//     console.log('renamed complete');
// });
// fs.stat('./teste-renamed.js', (err, stats) => {
//     if (err) throw err;
//     console.log(`stats: ${JSON.stringify(stats)}`);
// });

var fileName = '',
    fileExtension = '',
    tempNameNoExtension = '',
    fileRenamed = '',
    finalOutputPath = '';

try {
    setup();
    rename();
    fs.stat(finalOutputPath, (err, stats) => {
        if (err) throw err;
        console.log('sucess:', `stats: ${JSON.stringify(stats)}`);
    });
} catch (ex) {
    console.log('ex:', ex.message());
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
    fs.createReadStream(filePath).pipe(fs.createWriteStream(finalOutputPath));
};

function removePathFromFileName(input) {
    var output = input;

    //src/js/hello.js -> hello.js
    output = input.replace(/\w+\//g, '');

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

function concatNamedVersion(options) {
    var output = '';

    output = options.name + options.version + options.extension;

    return output;
};