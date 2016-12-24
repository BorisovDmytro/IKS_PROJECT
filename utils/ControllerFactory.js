"use strict"

const AuthCtrl = require("./../controllers/AuthCtrl");
const MessengerController = require("./../controllers/MessengerController");

class ControllerFactory {
  static createAuthCtrl(accountCtrl) {
    return new AuthCtrl(accountCtrl);
  }

  static createMessengerController(httpServer, dbMsgCtrl) {
    return new MessengerController(httpServer, dbMsgCtrl);
  }

}

module.exports = ControllerFactory;