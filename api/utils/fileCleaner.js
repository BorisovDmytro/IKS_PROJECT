'use strict'

const fs    = require('fs')
const path  = require('path')

var folder = __dirname + '../../upload';
var now = new Date();


fs.readdir(folder, function (err, files) {
  if (err) return console.error(err)

  for (let file of files) {
    const pathFile = path.join(folder, file);
    let status;
    try {
      status = fs.statSync(pathFile);
    } catch (exp) {
      status = null;
      console.error("Cant get dfile status");
    }

    if (status && !status.isDirectory()) {

      console.log((now - status.birthtime))
      if((now - status.birthtime) > 3600000)
      try {
        fs.unlinkSync(pathFile);
      } catch(exp) {
        console.error('Cant remove file', pathFile, exp);
      }
    }
    
  }

});
