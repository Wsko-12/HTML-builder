
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const file = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface({ input:process.stdin, output:process.stdout });

console.log('Hello! Please enter something to save it in text.txt');

rl.on('line',(line)=>{
  if(line === 'exit'){
    exit();
  }
  file.write(line + '\n');
});

rl.on('SIGINT',()=>{
  exit();
});

function exit(){
  console.log('Good bye! :)');
  process.exit();
}