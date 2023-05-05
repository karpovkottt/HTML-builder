const fs = require ('fs');
const { stdin, stdout } = process;

const fileName = __dirname + '/write.txt';

stdout.write('Введите любой текст и нажмите Enter: ');

stdin.on ('data', (data) => {
  let text = data.toString().trim();

  if (text !== 'exit') {
    fs.writeFile(fileName, text, (err) => {
      if (err) throw err;
    });
    console.log(`\nСтрока ${text} записана в файл write.txt`);
    stdout.write('\nДля выхода введите команду exit или продолжите ввод:');
  } else {
    process.exit();
  }
});

process.on('exit', () => console.log('Спасибо, Ваш ввод завершен.'));

process.on('SIGINT', () => {
  console.log('Процесс завершен с помощью Ctrl+C');
  process.kill(process.pid, 'SIGINT');
});