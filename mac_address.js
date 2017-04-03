'use strict'

const getMac = require('getMac');

getMac.getMac(function (err, macAddress) {
  console.log('mac address:', macAddress);
});