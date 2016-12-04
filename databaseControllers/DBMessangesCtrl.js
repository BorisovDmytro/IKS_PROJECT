"use strict"

class DBMessangesCtrl {
  constructor(db) {
    this.collection = db.collection('messanges');  
  }
}

module.exports = DBMessangesCtrl;