"use strict"

class DBFileCtrl {
  constructor(db) {
    this.collection = db.collection('files');  
  }
}

module.exports = DBFileCtrl;