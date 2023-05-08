const fs = require('fs');
const path = require('path');

const stylesPathDir = path.join(__dirname, 'styles');
const projectPathDir = path.join(__dirname, 'project-dist');
const writeStream = fs.createWriteStream(projectPathDir + '/bundle.css');

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