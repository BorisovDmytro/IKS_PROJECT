"use strict"

import async             from 'async'
import SocketServer      from 'socketcluster-server';
import EnDecrypter       from './../utils/EnDecrypter';
import ClientInstance    from './ClientInstance';
import ClientsController from './ClientsController'

const keyBD = "dsadsadsfdd";

export default class MessengerController {

  constructor(httpServer, dbMessangesCtrl, dbAccountCtrl) {
    this.clients         = new ClientsController();
    this.dbMessangesCtrl = dbMessangesCtrl;
    this.dbAccountCtrl   = dbAccountCtrl;
    this.server          = SocketServer.attach(httpServer);
    
    this.server.on('connection', (webSocket) => {
      let client = new ClientInstance(webSocket, this);
      this.clients.addUnAuth(client);

      webSocket.on("msg",                 this.messageHandler.bind(this));
      webSocket.on("getHistory",          this.historyHandler.bind(this));
      webSocket.on("getPrivate",          this.getPrivateMessage.bind(this));
      webSocket.on("getGroupAccountData", this.groupDataHandler.bind(this));
    });
  }

  addNewClient(id, client) {
    this.clients.set(id, client);
    this.dbAccountCtrl.update(id, null, null, null, null, true,
      (err) => {
        if (err)
          console.error(err);
      });
  }

  removeClient(id) {
    console.log("On close :", id);
    this.clients.delete(id);
    this.dbAccountCtrl.update(id, null, null, null, null, false,
      (err) => {
        if (err)
          console.error(err);
      });
  }

  messageHandler(data) {
    const encrypter = new EnDecrypter();

    let userSender = this.clients.get(data.from);
    data.message   = encrypter.uncryptoData(data.message, userSender.key);

    const encryptoMsg = encrypter.cryptoData(data.message, keyBD);
    this.dbMessangesCtrl.add(encryptoMsg, data.groupName, data.userName, data.to, data.from,
    (err, msg) => {
      if (err)
        console.log("Error save msg");
      else {
        msg.messages = data.message;

        if (data.groupName != "") {
          let clients = this.clients.values();
          for (let client of clients) {
            client.get().emit("newMessage", msg);
          }
        } else {
          let userSender = this.clients.get(data.from);
          if (userSender) {
            msg.messages = encrypter.cryptoData(data.message, userSender.key);
            userSender.get().emit("newMessage", msg);
          }
          
          let userListner = this.clients.get(data.to);  
          if (userListner) {
            msg.messages = encrypter.cryptoData(data.message, userListner.key);
            userListner.get().emit("newMessage", msg);
          }
            
        }
      }
    });
  }

  historyHandler(data, res) {
    console.log("getHistory", data);

    if (data.cursore !== undefined && data.groupName !== undefined) {
      this.dbMessangesCtrl.getGroupMessages(data.groupName, data.cursore, (err, data) => {
        if (err) {
          console.log("err laod data messages");
          res("err laod data messages", null);
        } else {

          const encrypter = new EnDecrypter();

          for(let itm of data) {
            itm.messages = encrypter.uncryptoData(itm.messages, keyBD);
          }

          res(null, data);
        }
      });
    } else {
      res("err load data messages", null);
    }
  }

  getPrivateMessage(data, res) {
    const to   = data.to;
    const from = data.from;

    this.dbMessangesCtrl.getPrivateMessages(to, from, 0, (err, data) => {
       if (err) {

          res("err laod data messages", null);
        } else {
         const encrypter = new EnDecrypter();
         const instance  = this.clients.get(from);
         const key = instance.key;

         for (let itm of data) {
           let msg = encrypter.uncryptoData(itm.messages, keyBD);
           itm.messages = encrypter.cryptoData(msg, key);
           console.log(itm);
         }

         res(null, data);
       }
    });
  }

  groupDataHandler(data, res) {
    this.dbAccountCtrl.getAll((err, array) => {
      let clientInfo = [];

      for (let account of array) {
        clientInfo.push({
          id: account._id,
          name: account.name,
          online: account.online
        });
      }

      res(null, clientInfo);
    });
  }
}
