"use strict"

export default class DBFileCtrl {
  constructor(db) {
    this.collection = db.collection('files');  
  }
}
