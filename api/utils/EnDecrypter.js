import CryptoJS from "crypto-js";

export default class EnDecrypter {
  cryptoData(data, key) {
    const ciphertext = CryptoJS.AES.encrypt(data, key);
    return ciphertext.toString();
  }

  uncryptoData(data, key) {
    const bytes    = CryptoJS.AES.decrypt(data, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}