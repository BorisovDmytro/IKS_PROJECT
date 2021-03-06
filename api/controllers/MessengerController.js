"use strict"

import async from 'async'
import SocketServer from 'socketcluster-server';
import EnDecrypter from './../utils/EnDecrypter';
import ClientInstance from './ClientInstance';
import ClientsController from './ClientsController'

const keyBD = "dsadsadsfdd";

export default class MessengerController {

  constructor(httpServer, dbMessangesCtrl, dbAccountCtrl, dbGroupCtrl) {
    this.clients         = new ClientsController();
    this.dbMessangesCtrl = dbMessangesCtrl;
    this.dbAccountCtrl   = dbAccountCtrl;
    this.dbGroupCtrl     = dbGroupCtrl;
    this.server          = SocketServer.attach(httpServer);

    this.server.on('connection', (webSocket) => {
      let client = new ClientInstance(webSocket, this);

      webSocket.on("msg", this.messageHandler.bind(this));
      webSocket.on("getHistory", this.historyHandler.bind(this));
      webSocket.on("getPrivate", this.getPrivateMessage.bind(this));
      webSocket.on("getGroupAccountData", this.groupDataHandler.bind(this));

      // NEW API FOR UNREAD MESSAGESS
      // data {id: id} id - client id
      // result array [{id, name}]
      webSocket.on('getUnread', this.getUnread.bind(this));
      // data {id: id, readId: readId} - id -client, readId - id client unread message
      webSocket.on('setRead', this.setRead.bind(this));

      this.clients.addUnAuth(client);
    });
  }

  addNewClient(id, client) {
    this.clients.set(id, client);

    this.dbAccountCtrl
      .update(id, null, null, null, null, true)
      .then(() => { })
      .catch((err) => {
        console.error(err);
      });
  }

  removeClient(id) {
    this.clients.delete(id);

    this.dbAccountCtrl.update(id, null, null, null, null, false)
      .then(() => { })
      .catch((err) => {
        console.error(err);
      });
  }

  getUnread(data, res) {
    const id = data.id;
    if (id) {
      this.dbAccountCtrl
        .getById(id)
        .then((obj) => {
          const unrd = obj.unread || [];
          res(null, unrd);
        })
        .catch((err) => {
          res(err);
        });
    } else {
      res("Not valid data");
    }
  }

  setRead(data) {
    const id = data.id;
    const readId = data.readId;

    if (!id || !readId) {
      return;
    }

    this.dbAccountCtrl
      .getById(id)
      .then((account) => {
        let unread = account.unread || [];

        unread.forEach((itm, i) => {
          if (itm.id == readId) {
            unread.splice(i, 1);
          }
        });

        account.unread = unread;
        return this.dbAccountCtrl.updateObejct(account);
      }).then((obj) => {
        console.log('Set unread onject', id, readId);
      }).catch((err) => {
        console.error("Error update account", err);
      });
  }

  messageHandler(data) {
    const encrypter = new EnDecrypter();

    let userSender    = this.clients.get(data.from);
    data.message      = encrypter.uncryptoData(data.message, userSender.key);
    const encryptoMsg = encrypter.cryptoData(data.message, keyBD);

    this.dbMessangesCtrl
      .add(encryptoMsg, data.groupName, data.userName, data.to, data.from, data.fileLink)
      .then((msg) => {
        msg.messages = data.message;

        if (data.groupName != "") {
          this.dbGroupCtrl
          .getByName(data.groupName)
          .then((group) => {
            const users = group.users;
            for (let user of users) {
              let client = this.clients.get(user);
              if (client) {
                msg.messages = encrypter.cryptoData(data.message, client.key);
                client.get().emit("newMessage", msg);
              }
            }
          })
          .catch((err) => {
            console.error(err);
          });

          /*let clients = this.clients.values(); // TODO when add group support send to group members
          for (let client of clients) {
            msg.messages = encrypter.cryptoData(data.message, client.key);
            client.get().emit("newMessage", msg);
          }*/
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
          this.dbAccountCtrl
            .getById(data.to)
            .then((account) => {
              account.unread = account.unread || [];

              let isNeedSave = true;

              account.unread.forEach((itm, i) => {
                if (itm.id.toString() == data.from.toString())
                  isNeedSave = false;
              });

              if (isNeedSave) {
                account.unread.push({ id: data.from, name: data.userName });
              }

              return this.dbAccountCtrl.updateObejct(account);
            }).then((acnt) => {
              console.log('Save unread message');
            }).catch((err) => {
              console.error("Error update account", err);
            });
        }
      })
      .catch((err) => { console.log("Error save msg:", err); });
  }

  historyHandler(data, res) {

    if (data.cursore == undefined ||
      data.groupName == undefined || data.from == undefined) {
      res("err load data messages", null);
      return;
    }

    this.dbMessangesCtrl
      .getGroupMessages(data.groupName, data.cursore)
      .then((array) => {
        const encrypter = new EnDecrypter();
        const instance = this.clients.get(data.from);
        const key = instance.key;
        // TODO ADD CRYPTO FOR  GET GROUP HISTORY IN SERVER AND CLIENT 
        for (let itm of array) {
          const msg = encrypter.uncryptoData(itm.messages, keyBD);
          itm.messages = encrypter.cryptoData(msg, key);
        }

        res(null, array);
      })
      .catch((err) => {
        res("err laod data messages", null);
      });
  }

  getPrivateMessage(data, res) {
    const to = data.to;
    const from = data.from;

    this.dbMessangesCtrl
      .getPrivateMessages(to, from, 0)
      .then((data) => {
        const encrypter = new EnDecrypter();
        const instance = this.clients.get(from);
        const key = instance.key;

        for (let itm of data) {
          let msg = encrypter.uncryptoData(itm.messages, keyBD);
          itm.messages = encrypter.cryptoData(msg, key);
        }

        res(null, data);
      })
      .catch((err) => {
        res(err);
      });
  }

  groupDataHandler(data, res) {
    this.dbAccountCtrl
      .getAll()
      .then((array) => {
        let clientInfo = [];

        for (let account of array) {
          clientInfo.push({
            id: account._id,
            name: account.name,
            online: account.online
          });
        }

        res(null, clientInfo);
      })
      .catch((err) => {
        res(err);
      });
  }
}
