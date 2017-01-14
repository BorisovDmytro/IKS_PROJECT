"use strict"

import async        from 'async' 
import SocketServer from 'socketcluster-server';
import EnDecrypter  from './../utils/EnDecrypter'; 

const key = "dsadsadsfdd";

export default class MessengerController {

  constructor(httpServer, dbMessangesCtrl, dbAccountCtrl) {
    this.clients         = new Map();
    this.dbMessangesCtrl = dbMessangesCtrl;
    this.dbAccountCtrl   = dbAccountCtrl;
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
            this.dbAccountCtrl.update(id, null, null, null, null, true, (err) => {
              if(err) 
                console.error(err);
              this.onChangeOnline("Public");
            });
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
         console.log("On close :", webSocket.id);
         const id = webSocket.id;
         this.clients.delete(id);
         this.dbAccountCtrl.update(id, null, null, null, null, false, (err) => {
            if(err) 
              console.error(err);
            this.onChangeOnline("Public");
         });
      });

      webSocket.on("getOnline", (data, res) => {
        this.getAllOnlineByGroup("Public", (account) => res(null, account));
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

  getAllOnlineByGroup(group, cb) {
    console.log("getAllOnlineByGroup", group, cb);

    this.dbAccountCtrl.getAllOnline((err, array) => {
      console.log(array);
      let accounts = [];
      for (let item of array) {
        accounts.push(item.name);
      }
      cb(accounts);
    });
  }

  onChangeOnline(group) {
    this.getAllOnlineByGroup(group, (accounts) => {
      let sockets = this.clients.values();
      for (let socket of sockets) {
        socket.emit("changeOnline", accounts);
      }
    });
  }

}
