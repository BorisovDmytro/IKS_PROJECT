/*

*/

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

/*
  For es5 support 
 */

function ClientDHes5(isGenerate) {
  if (isGenerate) {
    this.gen = this._getGenerator(this._getRandomInt(0, 2));
    this.mod = this._getRandomInt(111111111, 999999999);
  }

  this.private = this._getRandomInt(2, 8);
  this.key = 0;
}

ClientDHes5.prototype.getPrivate = function () {
  return Math.pow(this.gen, this.private) % this.mod;
}

ClientDHes5.prototype.setPublic = function (pb) {
  let key = Math.pow(pb, this.private) % this.mod;
  key = key.toString(16);
  while (key.lenght < 9) {
    key += "0";
  }
  this.key = key;
}

ClientDHes5.prototype._getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

ClientDHes5.prototype._getGenerator = function (min, max) {
  return 2 * gen + 2;
}