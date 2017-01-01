angular.module("App").factory('messengerService', messengerService);

function messengerService() {
  var webSocket;
  var msgLoadingCb = function(data) {}
  var msgUpdateCb  = function(data) {}

  return {
    subscribeMessageLoading(cb) {
      msgLoadingCb = cb;
    },

    subscribeMessageUpdate(cb) {
      msgUpdateCb = cb;
    },

    load(groupName, idAccount) {

    },

    send(userName, groupName, message) {
      webSocket.emit("msg", {userName: userName, groupName: groupName, message: message});
    },

    getHistory(groupName, cursore) {
      webSocket.emit("getHistory", {groupName: groupName, cursore: cursore},
       function(err, data) {
         if(!err) {
           console.log("getHistory", data);
           msgLoadingCb(data);
         }
        });
    },

    initialize(account, cb) {
      var self = this;

      webSocket = new socketCluster.connect({id: account.id});
      webSocket.on('connect', function () {
        console.log('CONNECTED');

        webSocket.on("dataMsg", function(data) {
          console.log("dataMsg", data);
          msgLoadingCb(data);
        });

        webSocket.on("newMessage", function(data) {
          console.log("newMessage", data);
          msgUpdateCb(data); 
        });

        webSocket.emit("auth", {id: account.id}, 
          function(err, answ) {
            if(!err)
              self.getHistory("Public", 0);
            else 
              alert("Error auth");  
            cb(err);  
          });
      });
    }
  };
};