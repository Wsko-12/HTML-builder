const fs = require('fs');
const path = require('path');

fs.promises.rm(path.join(__dirname,'project-dist'),{ recursive: true, force: true }).then(()=>{
  fs.promises.mkdir(path.join(__dirname,'project-dist'),{recursive:true}).then(()=>{
      
    //copy assets
    copyDir(path.join(__dirname,'assets'),path.join(__dirname,'project-dist','assets')).then(()=>{
      buildHtml().then((buildedHtml)=>{
        const writeHtmlStream = fs.createWriteStream(path.join(__dirname,'project-dist','index.html'), 'utf8');
        writeHtmlStream.write(buildedHtml, ()=>{
          writeHtmlStream.close();
          buildStyle().then(buildedCss =>{
            const writeCssStream = fs.createWriteStream(path.join(__dirname,'project-dist','style.css'), 'utf8');
            writeCssStream.write(buildedCss,()=>{
              writeCssStream.close();
            });
          });
        });
      });
    });

    async function copyDir(from,to){
      return new Promise((result)=>{
        //first create a folder "to"
        fs.promises.mkdir(to).then(()=>{
          //second read files in "from" and try copy it
          fs.promises.readdir(from,{withFileTypes: true}).then((files)=>{
            let index = 0;
            copy();
            function copy(){
              //if in previous call was last file return result
              if(index === files.length){
                result(to);
                return;
              }
              //if file directory -> call recursion
              if(files[index].isDirectory()){
                copyDir(path.join(from,files[index].name),path.join(to,files[index].name)).then(()=>{
                  index++;
                  copy();
                });
              }else{
                //if file -> just copy it
                fs.promises.copyFile(path.join(from,files[index].name),path.join(to,files[index].name)).then(()=>{
                  index++;
                  copy();
                });
              }
            } 
          });
        });
      });
    }

    
    async function buildHtml(){
      return new Promise((result)=>{
        const readHtmlStream = fs.createReadStream(path.join(__dirname,'template.html'),'utf8');
        readHtmlStream.on('data',(templateData)=>{
          const components = templateData.match(/{{.+}}/g);
          let index = 0;
          function replaceComponent(){
            if(index === components.length){
              result(templateData);
              readHtmlStream.close();
              return;
            }
            const component = components[index].match(/{{(.+)}}/)[1];
            const componentReadStream = fs.createReadStream(path.join(__dirname,'components', component+'.html'),'utf8');
            componentReadStream.on('data',(componentData)=>{
              templateData = templateData.replace(components[index],componentData);
              index++;
              replaceComponent();
            });
          }
          replaceComponent();
        }); 
      });
    }

    async function buildStyle(){
      return new Promise((result)=>{
        fs.promises.readdir(path.join(__dirname, 'styles'),{withFileTypes: true}).then((files)=>{
          let bundle = '';
          let index = 0;
          function read(){
            if(index === files.length){
              result(bundle);
              return;
            }
            const file = files[index];
            if(file.isFile() && path.extname(file.name) === '.css'){
              const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), 'utf8');
              readStream.on('data', (data)=>{
                bundle += data;
                index++;
                readStream.close();
                read();
              });
            }else{
              index++;
              read();
            }
          }
          read();
        });
      });
    }
  });
});