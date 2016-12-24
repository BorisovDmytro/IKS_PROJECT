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

    load: function (groupName, idAccount) {

    },

    send: function (userName, groupName, message) {
      webSocket.emit("msg", {userName: userName, groupName: groupName, message: message});
    },

    initialize: function () {
      webSocket = new socketCluster.connect();
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

        webSocket.emit("loadMsg", {groupName: "Public", cursore: 0});
      });
    }
  };
};