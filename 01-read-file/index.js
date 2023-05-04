const fs = require('fs');

let readStream = fs.createReadStream(__dirname + '/text.txt');
readStream.setEncoding('utf-8');

readStream.on('data', (chunk) => {
    console.log(chunk);
})