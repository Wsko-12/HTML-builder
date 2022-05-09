const fs = require('fs');
const path = require('path');

function copyDir(){
  fs.promises.rm(path.join(__dirname,'files-copy'),{ recursive: true, force: true }).then(()=>{
    fs.promises.mkdir(path.join(__dirname,'files-copy'),{recursive:true})
      .then(()=>{
        fs.promises.readdir(path.join(__dirname, 'files'),{withFileTypes: true})
          .then((files)=>{
            let index = 0;
            function copy(){
              const filePath = path.join(__dirname,'files',files[index].name);
              const copyPath = path.join(__dirname,'files-copy',files[index].name);
              fs.promises.copyFile(filePath,copyPath)
                .then(()=>{
                  index++;
                  if(index < files.length) copy();
                });
            }
            if(files.length){
              copy();
            }
          });
      });
  });
}
copyDir();


