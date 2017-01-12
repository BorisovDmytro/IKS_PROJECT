"use strict"

import async        from 'async' 
import SocketServer from 'socketcluster-server';
import EnDecrypter  from './../utils/EnDecrypter'; 

const key = "dsadsadsfdd";

export default class MessengerController {

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
        const encrypter = new EnDecrypter();
        encrypter.cryptoData(data.message, key, (encryptoMsg) => {
          this.dbMessangesCtrl.add(encryptoMsg, data.groupName, data.userName, (err, msg) => {
            if (err)
              console.log("Error save msg");
            else {
              let sockets = this.clients.values();
              msg.message = data.message;
              for (let socket of sockets) {
                socket.emit("newMessage", msg);
              }
            }
          }); 
        });
       });

       webSocket.on("disconnect", () => {
         console.log("On close ");
         const id = webSocket.id;
         this.clients.delete(id);
      });

      webSocket.on("getHistory", (data, res) => {
        console.log("getHistory", data);

        if(data.cursore  !== undefined && data.groupName !== undefined) {
          this.dbMessangesCtrl.getGroupMessages(data.groupName, data.cursore, (err, data) => {
            if (err) {
              console.log("err laod data messages");
              res("err laod data messages", null);
            } else {
              async.map(data, (item, cb) => {
                console.log(item);
                 const encrypter = new EnDecrypter();
                 encrypter.uncryptoData(item.messages, key, (uncrypto) => {
                   item.messages = uncrypto;
                   cb(null, item)
                 });
              }, (err, resualt) => {
                res(null, resualt);
              });
            }
          });
        } else {
          res("err load data messages", null);
        }
      });
    });
  }

}
