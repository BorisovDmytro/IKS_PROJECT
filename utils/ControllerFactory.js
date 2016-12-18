"use strict"

const AuthCtrl = require("./../controllers/AuthCtrl");
const MessengerController = require("./../controllers/MessengerController");

class ControllerFactory {
  static createAuthCtrl(accountCtrl) {
    return new AuthCtrl(accountCtrl);
  }

  static createMessengerController(httpServer) {
    return new MessengerController(httpServer);
  }

}

module.exports = ControllerFactory;