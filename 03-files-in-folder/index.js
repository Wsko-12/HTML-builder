const fsProms = require('fs/promises');
const path = require('path');

fsProms.readdir(path.join(__dirname, 'secret-folder'),{withFileTypes: true}).then((files)=>{
  files.forEach(file=>{
    if(file.isFile()){
      fsProms.stat(path.join(__dirname, 'secret-folder',file.name)).then((stat)=>{
        const extension = path.extname(file.name);
        const name = path.basename(file.name,extension);
        console.log(`${name} - ${extension.slice(1)} - ${stat.size/1000}kb`);
      });
    }
  });
});