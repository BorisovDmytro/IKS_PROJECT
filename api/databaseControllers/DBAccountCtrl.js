"use strict"

import moment     from 'moment';
import Mongodb    from 'mongodb';
import Encryption from './../utils/Encryption.js';

const ObjectID = Mongodb.ObjectID;

export default class DBAccountCtrl {
  constructor(db) {
    this.collection = db.collection('accounts');  
  }

  insert(email, name, pass, cb) {
    this.collection.findOne({ $or: [{ email: email }, { name: name }] }, (err, doc) => {
      if (doc) {
        cb("data-token");
      } else {
        var account = {
          email:     email,
          name:      name,
          pass:      Encryption.saltAndHash(pass),
          create:    moment().format('MMMM Do YYYY, h:mm:ss a'),
          loginTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
          online: false
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
  update(id, email, name, pass, loginTime, online, cb) {
    this.collection.findOne({_id: ObjectID(id)}, (err, doc) => {
      if(err) {
        cb("not found");
      } else {
        doc.email     = email     || doc.email;
        doc.name      = name      || doc.name;
        doc.pass      = pass      || doc.pass;
        doc.loginTime = loginTime || doc.loginTime;
        doc.online    = online

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

  getByEmail(email, cb) {
    this.collection.findOne({email: email}, cb);
  }

  getByEmailOrName(email, name, cb) {
    this.collection.findOne({ $or: [{email: email}, {name: name}] }, cb);
  }

  getAllOnline(cb) {
    this.collection.find({online: true}).toArray(cb);
  }
}
