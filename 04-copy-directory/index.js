const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

function copyDir() {
    fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, err => {
        if (err) throw err;
    });
    readdir(path.join(__dirname, 'files-copy'), { withFileTypes: true }).then(files => files.forEach(file => {
        fs.unlink(path.join(__dirname, 'files-copy', file.name), err => {
            if (err) throw err;
            console.log(`${file.name} is deleted from folder "files-copy".`);
        })
    }))
    readdir(path.join(__dirname, 'files'), { withFileTypes: true }).then(files => files.forEach(file => {
        fs.copyFile(path.join(__dirname, 'files', file.name), path.join(__dirname, 'files-copy', file.name), err => {
            if (err) throw err;
            console.log(`${file.name} is copied to folder "files-copy".`);
        });
    }))
}

copyDir();