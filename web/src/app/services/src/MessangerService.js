'use strcit'

export default (app) => {

  class EnDecrypter {
    cryptoData(data, key) {
      const ciphertext = CryptoJS.AES.encrypt(data, key);
      return ciphertext.toString();
    }

    uncryptoData(data, key) {
      const bytes = CryptoJS.AES.decrypt(data, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    }
  }

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

  class MessangerService {
    constructor() {
      this.listners = {
        "history": new Function(),
        "newMessage": new Function(),
        "private": new Function()
      };
    }

    setListener(name, cbHandlers) {
      // TODO CHEACK Type cbHandlers mast be Function
      this.listners[name] = cbHandlers;
    }

    send(userName, groupName, to, from, message, fileLink) {
      const endcrp = new EnDecrypter();
      message = endcrp.cryptoData(message, this.key);
      this.webSocket.emit("msg", { userName: userName, groupName: groupName, message: message, to: to, from: from, fileLink: fileLink });
    }

    getHistory(groupName, cursore, from) {
      var requestData = { groupName: groupName, cursore: cursore, from: from };
      // Add cheack data and webScoket
      this.webSocket.emit("getHistory", requestData, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log('getHistory', data);

        const endcrp = new EnDecrypter();
        const items = [];

        for (let itm of data) {
          itm.messages = endcrp.uncryptoData(itm.messages, this.key);
          items.push(itm);
        }

        this.listners["history"](items);
      });
    }

    getUnread(id, cb) {
      this.webSocket.emit("getUnread", {id: id} ,cb);
    }

    setRead(idAccount, readId) {
      this.webSocket.emit("setRead", {id: idAccount, readId: readId});
    }

    getPrivate(to, from) {
      const requestData = { to: to, from: from };

      this.webSocket.emit("getPrivate", requestData, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        const endcrp = new EnDecrypter();
        const items = [];

        for (let itm of data) {
          itm.messages = endcrp.uncryptoData(itm.messages, this.key);
          items.push(itm);
        }

        this.listners['private'](items);
      });
    }

    initialize(account, cb) {
      console.log('Initialize ....... ok');

      this.webSocket = new socketCluster.connect();

      this.webSocket.on('connect', () => {
        console.log('CONNECTED');

        this.webSocket.on('newMessage', (data) => {
          const endcrp = new EnDecrypter();
          data.messages = endcrp.uncryptoData(data.messages, this.key);
          this.listners["newMessage"](data);
        });

        this.clientDH = new ClientDH(true);

        const data = {
          id: account.id,
          private: this.clientDH.getPrivate(),
          gen: this.clientDH.gen,
          mod: this.clientDH.mod
        }
        console.log('Set public', data);
        this.webSocket.emit("auth", data, (err, answ) => {
          if (!err) {
            this.clientDH.setPublic(answ.private);
            this.key = this.clientDH.key.toString() + account.id;
          }
          else
            alert("Error auth");
          cb(err);
        });
      });
    }

    getGroupClients(groupName, cb) {
      this.webSocket.emit("getGroupAccountData", { groupName: groupName }, cb);
    }

    exit() {
      /*if(this.webSocket)
        this.webSocket.*/
    }
  }

  app.service('messangerService', MessangerService);
}


