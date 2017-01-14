"use strict"

import AuthCtrl            from "./../controllers/AuthCtrl"
import MessengerController from "./../controllers/MessengerController";

export default class ControllerFactory {
  static createAuthCtrl(accountCtrl) {
    return new AuthCtrl(accountCtrl);
  }

  static createMessengerController(httpServer, dbMsgCtrl, dbAccountCtrl) {
    return new MessengerController(httpServer, dbMsgCtrl, dbAccountCtrl);
  }
}
