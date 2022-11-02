const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true})
.then(files => files.forEach(file => {
    if (file.isFile()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        fs.stat(filePath, (err, stats) => {
            const fileSize = +stats.size/1024;
            console.log(String(file.name).split('.')[0] + ' - '
            + path.extname(filePath).slice(1) + ' - ' 
            + fileSize.toFixed(3) + 'kb')
        })
    }
}));