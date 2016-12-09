angular.module("App").factory('messengerService', messengerService);

function messengerService() {
  var webSocket;

  return {
    load: function (groupName, idAccount) {

    },

    send: function (idAccount, groupName, message) {

    },

    initialize: function () {
      webSocket = new socketCluster.connect();
      webSocket.on('connect', function () {
        console.log('CONNECTED');
      });
    }
  };
};