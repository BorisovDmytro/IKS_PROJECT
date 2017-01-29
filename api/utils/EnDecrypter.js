import Crypto from 'crypto'

export default class EnDecrypter {
  cryptoData(data, key, cb) {
    const cipher  = Crypto.createCipher('aes256', key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted    += cipher.final('hex');
    cb(encrypted);
  }

  uncryptoData(data, key, cb) {
    const decipher = Crypto.createDecipher('aes256', key);
    let decrypted  = decipher.update(data, 'hex', 'utf8');
    decrypted     += decipher.final('utf8');
    cb(decrypted);
  }
}
