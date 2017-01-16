"use strict"

import async             from 'async'
import SocketServer      from 'socketcluster-server';
import EnDecrypter       from './../utils/EnDecrypter';
import ClientInstance    from './ClientInstance';
import ClientsController from './ClientsController'

const key = "dsadsadsfdd";

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
    encrypter.cryptoData(data.message, key, (encryptoMsg) => {
      this.dbMessangesCtrl.add(encryptoMsg, data.groupName, data.userName, (err, msg) => {
        if (err)
          console.log("Error save msg");
        else {
          let clients = this.clients.values();
          msg.messages = data.message;
          
          for (let client of clients) {
            client.get().emit("newMessage", msg);
          }
        }
      });
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
          async.map(data, (item, cb) => {
            const encrypter = new EnDecrypter();
            encrypter.uncryptoData(item.messages, key, (uncrypto) => {
              console.log('uncrypto', uncrypto);
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
  }

  groupDataHandler(data, res) {
    this.dbAccountCtrl.getAll((err, array) => {
      let clientInfo = [];

      for (let account of array) {
        clientInfo.push({
          name: account.name,
          online: account.online
        });
      }

      res(null, clientInfo);
    });
  }
}
