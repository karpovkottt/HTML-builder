const fs = require ('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const stylesPathDir = path.join(__dirname, 'styles');
const projectPathDir = path.join(__dirname, 'project-dist');

const pathFiles = path.join(__dirname, 'assets');
const pathFilesCopy = path.join(__dirname, 'project-dist/assets');

async function creatStyleCss() {
  fs.readdir(stylesPathDir, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    const writeStream = fs.createWriteStream(projectPathDir + '/style.css');
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
}

async function makeDirectory() {

  fs.mkdir(pathFilesCopy, {recursive: true}, (err) => {
    if (err) throw err;
  });
}

async function copyDirectory() {

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
makeDirectory();
copyDirectory().then(creatStyleCss());

async function createHtml() {
  const pathTemplate = path.join(__dirname, 'template.html');
  const pathHTML = path.join(projectPathDir, 'index.html');
  const readStreamHTML = fs.createReadStream(pathTemplate, 'utf-8');
  const pathComponents = path.join(__dirname, 'components');
  const tagArray = [];
  const arrayComponentsPath = [];

  function arrayTag() {
    fs.readdir(pathComponents, {withFileTypes: true}, (err, files) => {
      if (err) throw err;
      files.forEach(file => {
        const fileTagName = file.name;
        const fileTagPath = path.join(pathComponents, fileTagName);
        const fileTagExt = path.extname(fileTagPath);
        const tagName = fileTagName.replace(fileTagExt, '');
        arrayComponentsPath.push(fileTagPath);
        tagArray.push(tagName);
      });
    });
  }

  arrayTag();

  readStreamHTML.on('data', async (chunk) => {
    let text = chunk.toString();
    for (let i = 0; i < tagArray.length; i += 1) {
      let readStreamComponentsTag = fs.createReadStream(arrayComponentsPath[i], 'utf-8');
      readStreamComponentsTag.on('data', data => {
        text = text.replace(`{{${tagArray[i]}}}`, `${data}`);
        fs.writeFile(pathHTML, text, err => {
          if (err) throw err;
        });
      });
    }
  });
}

createHtml();