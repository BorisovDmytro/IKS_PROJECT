'use strict'


class ClientDH {
  constructor(isGenerate) {
    if (isGenerate) {
      this.gen = this._getGenerator(this._getRandomInt(0, 2));
      this.mod = this._getRandomInt(111111111, 999999999);
    }

    this.private = this._getRandomInt(2, 8);
    this.key = 0;
  }

  getPrivate() {
    return Math.pow(this.gen, this.private) % this.mod;
  }

  setPublic(pb) {
    let key = Math.pow(pb, this.private) % this.mod;
    key = key.toString(16);
    while (key.lenght < 9) {
      key += "0";
    }
    this.key = key;
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _getGenerator(gen) {
    return 2 * gen + 2;
  }
}

let successCnt = 0;
let badCnt = 0;
let cnt = 1000000;

for (var i = 0; i < cnt; i++) {

  var alice = new ClientDH(true);
  var bob   = new ClientDH(false);

  bob.gen = alice.gen;
  bob.mod = alice.mod;

  var pA = alice.getPrivate();
  var pB = bob.getPrivate();

  alice.setPublic(pB);
  bob.setPublic(pA);

  if (alice.key == bob.key) {
    successCnt ++;
  } else {
    badCnt ++;
  }

}

console.log("Success :", successCnt * 100 / cnt, 'Bad:', badCnt * 100/ cnt);

