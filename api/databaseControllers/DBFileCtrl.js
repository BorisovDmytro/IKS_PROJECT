"use strict"

import moment from 'moment';
import Mongodb from 'mongodb';
import Encryption from './../utils/Encryption.js';

const ObjectID = Mongodb.ObjectID;

//_id ( auto gen)
//name
//size
//owner
//groupName

export default class DBFileCtrl {
  constructor(db) {
    this.collection = db.collection('files');
  }

  insert(id, name, size, owner, groupName, cb) {

  }
  // если параметр null, то задает старое значение в обекте 
  update(id, obj, cb) {
   
  }

  remove(id, cb) {
    
  }

  getById(id, cb) {
   
  }
}

