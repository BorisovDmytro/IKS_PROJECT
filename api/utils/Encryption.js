'use strict'

import crypto from 'crypto';

export default class Encryption {
  static get salt() {
    return '854adec3dsa1e232b15e21691dfafdssdffdsfsdfds'
  }

  static md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
  }

  static saltAndHash (pass) {
    return this.salt + this.md5(pass + this.salt);
  }

  static validatePassword(plainPass, hashedPass) {
    return hashedPass == this.saltAndHash(plainPass);
  }
}