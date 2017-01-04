"use strict"

/**
 *  _id
 *  name
 *  owner
 *  users = []
 */

export default class DBGroupCtrl {
  constructor(db) {
    this.collection = db.collection('group');  
  }

  add(name, owner, cb) {

  }

  update(id, obj, cb) {

  }

  removeById(id, cb) {

  }

  removeByName(name, cb) {

  }

  getById(id, cb) {

  }

  getByName(name, cb) {
    
  }

}
