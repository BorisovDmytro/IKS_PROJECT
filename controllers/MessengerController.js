"use strict"

const SocketServer  = require('socketcluster-server');

class MessengerController {

  constructor(httpServer) {
    this.server = SocketServer.attach(httpServer);
    this.server.on('connection', (webSocket) => {
      console.log("Connect done");
    });
  }

}

module.exports = MessengerController;