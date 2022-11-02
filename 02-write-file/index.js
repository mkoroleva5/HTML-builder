const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require("process");

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Приветствую! Введите текст:\n');
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') process.exit();
    output.write(data);
    stdout.write('Добавлена запись: ');
    stdout.write(data);
});
process.on('exit', () => stdout.write('Прощайте! Хорошего дня!'));
process.on('SIGINT', () => process.exit());
