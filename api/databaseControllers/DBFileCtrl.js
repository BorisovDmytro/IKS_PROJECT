"use strict"

import moment     from 'moment';
import Mongodb    from 'mongodb';
import Encryption from './../utils/Encryption.js';

const ObjectID = Mongodb.ObjectID;

export default class DBFileCtrl {
  constructor(db) {
    this.collection = db.collection('files');  
  }
}


    //_id ( auto gen)
    //name
    //size
    //owner
    //groupName

export default class DBAccountCtrl {
  constructor(db) {
    this.collection = db.collection('files');  
  }
insert(email, name, pass, cb) {
    this.collection.findOne({ [{ name: name }] }, (err, doc) => {
      if (doc) {
        cb("data-token");
      } else {
        var file = {
          name:      name,
          size:      size,
          owner:     owner,
          groupName: groupName
          
        };

        this.collection.insert(account, { safe: true }, (err, res) => {
          if (err)
            cb(err);
          else
            cb(null, res.ops[0]);
        });
      }
    });
  }
// если параметр null, то задает старое значение в обекте 
  update(id, email, name, pass, loginTime, cb) {
    this.collection.findOne({_id: ObjectID(id)}, (err, doc) => {
      if(err) {
        cb("not found");
      } else {

        doc.name      = name || doc.name,
        doc.size      = size || doc.size,
        doc.owner     = owner || doc.owner,
        doc.groupName = groupName || doc.groupName

        this.collection.save(doc, { safe: true }, (err) => {
          if(err)
            cb("error save");
          else 
            cb(null, doc);
        });        
      }
    });
  }

  remove(id, cb) {
    this.collection.remove({ _id: new ObjectID(id) }, cb);
  }

  getById(id, cb) {
    this.collection.findOne({_id: new ObjectID(id)}, cb);
  }

  getByName(name, cb) {
    this.collection.findOne({name: name}, cb);
  }

   getBygroupName(groupName, cb) {
    this.collection.findOne({groupName: groupName}, cb);
  }

  getByNameOrOwner(ename, owner, cb) {
    this.collection.findOne({ $or: [{name: name}, {owner: owner}] }, cb);
  }
}

