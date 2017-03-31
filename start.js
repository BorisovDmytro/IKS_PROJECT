const key = process.argv[2];
//C1B1D022C231
const getMac        = require("getMac");
const childProcess  = require('child_process');

function keyGen(mac) {
  var items = mac.split("-");

  var key = [];

  for (var itm of items) {
    key.push(itm[1].toString() + itm[0].toString());
  }

  return key.join('');
}

getMac.getMac(function(err,macAddress){
    if (err)  throw err;
    console.log("mac address:", macAddress);

    if (key == keyGen(macAddress)) {
      console.log('Start server application');
      childProcess.exec("npm run app", null, (err, stdout, stderr) => {
        if (err)
          console.error(err);
        
        if (stdout) 
          console.log(stdout);

        if (stderr)
          console.error(stderr);
      });
    } else {
      console.log('Не верный ключ');
    }
});