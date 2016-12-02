"use strict"

const DBAccountCtrl   = require("./../databaseControllers/DBAccountCtrl");
const DBFileCtrl      = require("./../databaseControllers/DBFileCtrl");
const DBGroupCtrl     = require("./../databaseControllers/DBGroupCtrl");
const DBMessangesCtrl = require("./../databaseControllers/DBMessangesCtrl");

class DBControllerFactory {
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

module.exports = DBControllerFactory;