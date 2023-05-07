const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const pathFiles = path.join(__dirname, 'files');
const pathFilesCopy = path.join(__dirname, 'files-copy');

async function copyDirectory() {

  await fsPromises.rm(path.join(__dirname, 'files-copy'), {recursive: true, force: true});

  async function makeDirectory() {
    fs.mkdir(pathFilesCopy, {recursive: true}, (err) => {
      if (err) throw err;
    });
  }

  makeDirectory().then (
    fs.readdir(pathFiles, (err, files) => {
      if (err) throw err;

      files.forEach(file => {
        const filePath = path.join(pathFiles, file);
        const fileCopyPath = path.join(pathFilesCopy, file);
        fs.copyFile(filePath, fileCopyPath, (err) => {
          if (err) throw err;
          console.log(`${file} **скопирован в папку files-copy`);
        });
      });
    })
  );
}

copyDirectory();
