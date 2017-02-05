'use strcit'


function MessangerService(configService) {

  console.log("Create messanger service");
  this.configService = configService;

  this.listners = {
    "history": new Function(),
    "newMessage": new Function()
  };
}

MessangerService.prototype.setListener = function (name, cbHandlers) {
  // TODO CHEACK Type cbHandlers mast be Function
  this.listners[name] = cbHandlers;
}

MessangerService.prototype.send = function (userName, groupName, message) {
  this.webSocket.emit("msg", { userName: userName, groupName: groupName, message: message });
}

MessangerService.prototype.getHistory = function (groupName, cursore) {
  var requestData = { groupName: groupName, cursore: cursore };
  // Add cheack data and webScoket
  var self = this;

  this.webSocket.emit("getHistory", requestData, function(err, data) {
    if (!err) {
      self.listners["history"](data);
    }
  });
}

MessangerService.prototype.initialize = function (account, cb) {
  var options = {
    protocol: 'http',
    hostname: this.configService.url,
    port: this.configService.port
  };
  console.log('webSocket', options);
  try {
    this.webSocket = new socketCluster.connect(options);
  } catch (exp) {
    console.log('Error connection', exp);
  }
  

  var self = this;

  this.webSocket.on('connect', function() {
    console.log('webSocket..............CONNECTED');

    self.webSocket.on('newMessage', function (data) { self.listners["newMessage"](data); });

    self.webSocket.emit("auth", { id: account.id }, function (err, answ) {
      if (!err)
        self.getHistory("Public", 0);
      else
        alert("Error auth");
      cb(err);
    });
  });
}

MessangerService.prototype.getGroupClients = function (groupName, cb) {
  this.webSocket.emit("getGroupAccountData", { groupName: groupName }, cb);
}


angular.module("app").service('messangerService', MessangerService);