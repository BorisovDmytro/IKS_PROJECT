"use strict"

import AuthCtrl            from "./../controllers/AuthCtrl"
import MessengerController from "./../controllers/MessengerController"
import FileCtrl            from './../controllers/FileCtrl'  
import GroupApiController  from './../controllers/GroupController'

export default class ControllerFactory {
  static createAuthCtrl(accountCtrl) {
    return new AuthCtrl(accountCtrl);
  }

  static createMessengerController(httpServer, dbMsgCtrl, dbAccountCtrl) {
    return new MessengerController(httpServer, dbMsgCtrl, dbAccountCtrl);
  }

  static createFileController(uplaodDir, dbFielCtrl) {
    return new FileCtrl(uplaodDir, dbFielCtrl);
  }

  static createGroupApiController(dbGroupCtrl, dbAccountCtrl) {
    return new GroupApiController(dbGroupCtrl, dbAccountCtrl);
  }
}
