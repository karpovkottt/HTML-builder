const fs = require ('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const stylesPathDir = path.join(__dirname, 'styles');
const projectPathDir = path.join(__dirname, 'project-dist');
const writeStream = fs.createWriteStream(projectPathDir + '/style.css');

const pathFiles = path.join(__dirname, 'assets');
const pathFilesCopy = path.join(__dirname, 'project-dist/assets');

fs.readdir(stylesPathDir, {withFileTypes: true}, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const fileName = file.name;
    const filePath = path.join(stylesPathDir, fileName);
    const fileExt = path.extname(filePath);

    if (file.isFile && fileExt === '.css') {
      const readStream = fs.createReadStream(filePath);

      readStream.on('data', (chunk) => {
        writeStream.write(chunk.toString());
      });
    }
  });
});

async function copyDirectory() {

  await fsPromises.rm(path.join(__dirname, 'project-dist/assets'), {recursive: true, force: true});

  async function makeDirectory() {
    fs.mkdir(pathFilesCopy, {recursive: true}, (err) => {
      if (err) throw err;
    });
  }

  makeDirectory();
  copyAttachDirAndFiles(pathFiles, pathFilesCopy);
  async function copyAttachDirAndFiles(directory, destination) {
    await fsPromises.readdir(directory, {withFileTypes: true}).then((files) => {
      files.forEach(async(file) => {
        if (file.isDirectory()) {
          const pathDir = path.join(directory, file.name);
          const pathDestination = path.join(destination, file.name);
          copyAttachDirAndFiles(pathDir, pathDestination);
        } else {
          fs.mkdir(destination, {recursive: true}, (err) => {
            if (err) throw err;
          });
          const filePathDir = path.join(directory, file.name);
          const filePathDestination = path.join(destination, file.name);
          fsPromises.copyFile(filePathDir, filePathDestination);
        }
      });
    });
  }
}

copyDirectory();
