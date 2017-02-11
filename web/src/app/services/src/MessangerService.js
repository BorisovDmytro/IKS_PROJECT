'use strcit'

export default (app) => {
  function EnDecrypter() {

    this.cryptoData = function (data, key) {
      const ciphertext = CryptoJS.AES.encrypt(data, key);
      return ciphertext.toString();
    }

    this.uncryptoData = function (data, key) {
      const bytes     = CryptoJS.AES.decrypt(data, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    }
  }

  function KeyGen() {
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.gen = 3;
    this.mod = 17;
    this.private = getRandomInt(0, 20);
    this.key = 0;

    this.getPrivate = function () {
      return Math.pow(this.gen, this.private) % this.mod;
    }

    this.setPublic = function (pb) {
      this.key = Math.pow(pb, this.private) % this.mod;
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

    send(userName, groupName, to, from, message) {
      const endcrp = new EnDecrypter();
      message = endcrp.cryptoData(message, this.key);
      this.webSocket.emit("msg", { userName: userName, groupName: groupName, message: message, to: to, from: from });
    }

    getHistory(groupName, cursore) {
      var requestData = { groupName: groupName, cursore: cursore };
      // Add cheack data and webScoket
      this.webSocket.emit("getHistory", requestData, (err, data) => {
        console.log('Get history', err, data);
        this.listners["history"](data);
      });
    }

    getPrivate(to, from) {
      const requestData = {to: to, from: from };

      this.webSocket.emit("getPrivate", requestData, (err, data) => {
        console.log('Get private', err, data);
        const endcrp = new EnDecrypter();
        const items  = [];
        
        for(let itm of data) {
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

        this.keyGen = new KeyGen();

        this.webSocket.emit("auth", { id: account.id, private: this.keyGen.getPrivate()}, (err, answ) => {
          if (!err) {
             this.keyGen.setPublic(answ.private);
             this.key = this.keyGen.key.toString() + account.id;
             console.log('auth ... ok KEY: ', this.key);
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


