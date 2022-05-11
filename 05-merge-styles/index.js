const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname,'project-dist', 'bundle.css'));

fs.promises.readdir(path.join(__dirname, 'styles'),{withFileTypes: true}).then((files)=>{
  files.forEach((file) => {
    if(file.isFile() && path.extname(file.name) === '.css'){
      const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf8');
      readStream.on('data', (data)=>{
        writeStream.write(data);
      });
    }
  });
});
