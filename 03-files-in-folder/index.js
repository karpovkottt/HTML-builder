const fs = require('fs');
const path = require('path');

const pathDirectory = path.join(__dirname, 'secret-folder');

fs.readdir(pathDirectory, {withFileTypes: true}, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    if (file.isFile()) {
      const fileName = file.name;
      const filePath = path.join(pathDirectory, fileName);
      const fileExt = path.extname(filePath);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        console.log(`${fileName.replace(fileExt, '')} - ${fileExt.replace('.', '')} - ${(stats.size/1024).toFixed(3)}kb`);
      });
    }
  });
});
