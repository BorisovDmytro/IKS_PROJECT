"use strict"

import DBAccountCtrl   from "./../databaseControllers/DBAccountCtrl";
import DBFileCtrl      from "./../databaseControllers/DBFileCtrl";
import DBGroupCtrl     from "./../databaseControllers/DBGroupCtrl";
import DBMessangesCtrl from "./../databaseControllers/DBMessangesCtrl";

export default class DBControllerFactory {
  static createAccountCtrl(db) {
    return new DBAccountCtrl(db);
  }

  static createFileCtrl(db) {
    return new DBFileCtrl(db);
  }

  static createGroupCtrl(db) {
    return new DBGroupCtrl(db);
  }

  static createMessangesCtrl(db) {
    return new DBMessangesCtrl(db);
  }
}
