'use strcit'

class MessangerService extends IController {
  constructor() {
    super();

    this.listners = {
      "history": new Function(),
      "newMessage": new Function()
    };
  }

  setListener(name, cbHandlers) {
    // TODO CHEACK Type cbHandlers mast be Function
    this.listners[name] = cbHandlers;
  }

  send(userName, groupName, message) {
    this.webSocket.emit("msg", { userName: userName, groupName: groupName, message: message });
  }

  getHistory(groupName, cursore) {
    var requestData = { groupName: groupName, cursore: cursore };
    // Add cheack data and webScoket
    this.webSocket.emit("getHistory", requestData, (err, data) => {
      if (!err) {
        this.listners["history"](data);
      }
    });
  }

  initialize(account, cb) {
    this.webSocket = new socketCluster.connect();
    
    this.webSocket.on('connect', () => {
      console.log('CONNECTED');

      this.webSocket.on('newMessage', (data) => this.listners["newMessage"](data));

      this.webSocket.emit("auth", { id: account.id }, (err, answ) => {
        if (!err)
          this.getHistory("Public", 0);
        else
          alert("Error auth");
        cb(err);
      });
    });
  }

  getGroupClients(groupName, cb) {
    this.webSocket.emit("getGroupAccountData", { groupName: groupName }, cb);
  }
}

angular.module("app").service('messangerService', MessangerService);