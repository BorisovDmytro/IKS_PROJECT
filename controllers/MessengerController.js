"use strict"

const SocketServer  = require('socketcluster-server');

class MessengerController {

  constructor(httpServer, dbMessangesCtrl) {
    this.clients         = new Map();
    this.dbMessangesCtrl = dbMessangesCtrl;
    this.server          = SocketServer.attach(httpServer);

    this.server.on('connection', (webSocket) => {
      webSocket.on("auth", (data, res) => {
        let id = data.id;

        if(!id)
          res("invalid id");
        else {
          webSocket.id = id;
          console.log("New connect id: ", webSocket.id);
          if(!this.clients.has(id)) {
            this.clients.set(id, webSocket);
            res(null, "success");  
          } else {
            res("Acount is auth", null);
          }
        }
      });

      webSocket.on("msg", (data) => {
        console.log("msg connect id: ", webSocket.id);
        this.dbMessangesCtrl.add(data.message, data.groupName, data.userName, (err, msg) => {
          if(err) 
            console.log("Error save msg");
          else {
            let sockets = this.clients.values();
            for (var socket of sockets) {
              socket.emit("newMessage", msg);
            }
          } 
        });
       });

       webSocket.on("disconnect", () => {
         console.log("On close ");
         const id = webSocket.id;
         this.clients.delete(id);
      });

      webSocket.on("getHistory", (data, res) => {
        console.log("getHistory", data);

        if(typeof(data.cursore)   != "undefined" &&
           typeof(data.groupName) != "undefined") {

          this.dbMessangesCtrl.getGroupMessages(data.groupName, data.cursore, (err, data) => {
            if (err) {
              console.log("err laod data messages");
              res("err laod data messages", null);
            } else {
              res(null, data);
            }
          });
        } else {
          res("err load data messages", null);
        }
      });
    });
  }

}

module.exports = MessengerController;