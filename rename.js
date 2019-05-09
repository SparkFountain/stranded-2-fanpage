//requiring path and fs modules
const path = require('path');
const fs = require('fs');

const objPath = 'src/assets/objects';

let textures = [];

//joining path of directory
const directoryPath = path.join(__dirname, objPath);
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    if(file.endsWith('.mtl')) {
      // console.log(`${file}:`);
      fs.readFile(`${objPath}/${file}`, 'utf8', (err, data) => {
        if (err) throw err;

        data.replace(new RegExp('map_Kd\\s(.+)', 'g'), (match, p1) => {
          if(textures.indexOf(match) === -1) {
            console.info('[MATCH]', match);
            textures.push(match);
          }
          return match;
        });

        /* fs.writeFile(`${objPath}/${file}`, data.replace(new RegExp('map_Kd\\s(.+)', 'g'), (match, p1) => {
          // console.info('[MATCH]', match, p1);
          return `map_Kd ../textures/${p1}`;
        }), (err) => {
          if (err) throw err;
          // console.log(`The file ${objPath}/${file} has been saved!`);
        }); */
      });
    }
  });
});
