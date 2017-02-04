'use strcit'

export default (app) => {

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
      const requestData = {to: to, from: from};

      this.webSocket.emit("getPrivate", requestData, (err, data) => {
        console.log('Get private', err, data);
        this.listners['private'](data);
      });
    }

    initialize(account, cb) {
      console.log('Initialize ....... ok');

      this.webSocket = new socketCluster.connect();

      this.webSocket.on('connect', () => {
        console.log('CONNECTED');

        this.webSocket.on('newMessage', (data) => this.listners["newMessage"](data));

        this.webSocket.emit("auth", { id: account.id }, (err, answ) => {
          if (!err)
            console.log('auth ... ok');
           // this.getHistory("Public", 0);
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


