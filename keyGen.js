'use strict'

const mac      = process.argv[2];
const CryptoJS = require("crypto-js");

const key = "qwertygdhsabdsads321312avdahskdsvghdaskdsa3213jdasd";

if (!mac)
  throw new Error("not set mac address");

function keyGen(mac) {
  const ciphertext = CryptoJS.AES.encrypt(mac, key);
  return ciphertext.toString();
}

console.log('KEY:', keyGen(mac));