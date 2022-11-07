const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const { readFile, writeFile } = require("fs/promises");

async function buildPage() {
    await fs.promises.rm(path.join(__dirname,'project-dist'), {force: true, recursive: true}, async (err) => {
        if (err) throw err;
    });    
    await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, err => {
        if (err) throw err;
    });
    
    const stylesOutput = fs.createWriteStream(path.join(__dirname, 'project-dist/style.css'), 'utf-8');
    const stylesInput = await fs.promises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
    for (file of stylesInput) {
        if (file.isFile() && path.extname(path.join(__dirname, 'styles', file.name)) === '.css') {
            const input = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf8');
            input.on('data', data => {
                stylesOutput.write('\n' + data + '\n');
            });
        }
    }
    
    let template = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8');
    const comp = await fs.promises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
    for (file of comp) {
        if (file.isFile() && path.extname(path.join(__dirname, 'components', file.name)) === '.html') {
            let htmlFile = await fs.promises.readFile(path.join(__dirname, 'components', file.name));
            template = template.replace(`  {{${file.name.split('.')[0]}}}`, htmlFile);
        }
    }

    await fs.promises.writeFile(path.join(__dirname, 'project-dist/index.html'), template);

    async function copyDir(input, output) {
        const assets = await fs.promises.readdir(input, { withFileTypes: true });
        await fs.promises.mkdir(output, { recursive: true });
        for (file of assets) {
            if (file.isDirectory()) {
                await copyDir(path.join(input , file.name), path.join(output, file.name));
            } else {
                await fs.promises.copyFile(path.join(input , file.name), path.join(output, file.name));
            }
        }
    }
    copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist/assets'));
}
buildPage();