import Crypto from 'crypto'

export default class EnDecrypter {
  cryptoData(data, key, cb) {
    const cipher = Crypto.createCipher('aes192', key);

    let encrypted = "";

    cipher.on('readable', () => {
      let data = cipher.read();
      if (data)
        encrypted += data.toString('hex');
    });

    cipher.on('end', () => {
      cb(encrypted);
    });

    cipher.write(data);
    cipher.end();
  }

  uncryptoData(data, key, cb) {
    const decipher = Crypto.createDecipher('aes192', key);
    let uncrypto = "";

    decipher.on('readable', () => {
      let data = decipher.read();
      if (data)
        uncrypto += data.toString('utf8');
    });

    decipher.on('end', () => {
      cb(uncrypto);
    });

    decipher.write(data, 'hex');
    decipher.end();
  }
}
