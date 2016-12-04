"use strict"

class DBGroupCtrl {
  constructor(db) {
    this.collection = db.collection('group');  
  }
}

module.exports = DBGroupCtrl;