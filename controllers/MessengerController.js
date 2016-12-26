"use strict"

const SocketServer  = require('socketcluster-server');

class MessengerController {

  constructor(httpServer, dbMessangesCtrl) {

    this.clients = [];

    this.dbMessangesCtrl = dbMessangesCtrl;
    this.server = SocketServer.attach(httpServer);
    this.server.on('connection', (webSocket) => {
      console.log("Connect done");
      this.clients.push(webSocket);

      webSocket.on("msg", (data) => {
        this.dbMessangesCtrl.add(data.message, data.groupName, data.userName, (err, msg) => {
          if(err) 
            console.log("Error save msg");
          else {
            this.clients.forEach((socket) => {
              socket.emit("newMessage", msg);
            });
          } 
        });
       });

       webSocket.on("close", () => {
         let index = this.clients.indexOf(webSocket);
         if(index != -1) 
           this.clients(index, 1);
       });

        webSocket.on("getHistory", (data, res) => {
         console.log("loadMsg", data);
         this.dbMessangesCtrl.getGroupMessages(data.groupName, data.cursore, (err, data) => {
           if(err) {
             console.log("err laod data messages");
             res("err laod data messages", null);
           } else {
             res(null, data);               
           } 
         });
       });
    });
  }

}

module.exports = MessengerController;