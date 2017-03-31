'use strict'

const mac = process.argv[2];

if (!mac)
  throw new Error("not set mac address");

function keyGen(mac) {
  var items = mac.split("-");

  var key = [];

  for (var itm of items) {
    key.push(itm[1].toString() + itm[0].toString());
  }

  return key.join('');
}


console.log('KEY:', keyGen(mac));