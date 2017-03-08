"use strict"

import moment     from 'moment';
import Mongodb    from 'mongodb';
import Encryption from './../utils/Encryption.js';

const ObjectID = Mongodb.ObjectID;

moment.locale('ru');

export default class DBAccountCtrl {
  constructor(db) {
    this.collection = db.collection('accounts');  
  }

  insert(email, name, pass) {
    const prom = new Promise((resolve, reject) => {
      this.collection.findOne({ $or: [{ email: email }, { name: name }] }, (err, doc) => {
        if(doc) {
          reject("data-token");
        } else {
          const account = {
            email:     email,
            name:      name,
            pass:      Encryption.saltAndHash(pass),
            create:    moment().format('MMMM Do YYYY, h:mm:ss a'),
            loginTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
            online:    false,
            unread: []
          };

          this.collection.insert(account, { safe: true }, (err, res) => {
            if (err)
              reject(err);
            else
              resolve(res.ops[0]);
          });
        }
      });
    });

    return prom;
  }

  updateObejct(obj) {
    const prom = new Promise((resolve, reject) => {
      this.collection.findOne({ _id: ObjectID(obj._id) }, (err, doc) => {
        this.collection.save(obj, { safe: true }, (err) => {
          if (err)
            reject("error save");
          else
            resolve(obj);
        });
      });
    });

    return prom;
  }
  // если параметр null, то задает старое значение в обекте 
  update(id, email, name, pass, loginTime, online, unread) {
    const prom = new Promise((resolve, reject) => {

      this.collection.findOne({ _id: ObjectID(id) }, (err, doc) => {
        if (err) {
          reject("not found");
        } else {
          doc.email     = email || doc.email;
          doc.name      = name || doc.name;
          doc.pass      = pass || doc.pass;
          doc.loginTime = loginTime || doc.loginTime;
          doc.online    = online;
          doc.unread    = unread || doc.unread;

          this.collection.save(doc, { safe: true }, (err) => {
            if (err)
              reject("error save");
            else
              resolve(doc);
          });
        }
      });

    });

    return prom;
  }

  remove(id, cb) {
    this.collection.remove({ _id: new ObjectID(id) }, cb);
  }

  getById(id, cb) {
    this.collection.findOne({_id: new ObjectID(id)}, cb);
  }

  getByEmail(email) {
    const prom = new Promise((resolve, reject) => {
      this.collection.findOne({email: email}, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });

    return prom;
  }

  getByEmailOrName(email, name) {
    const prom = new Promise((resolve, reject) => {
      this.collection.findOne({ $or: [{email: email}, {name: name}] }, (err, account) => {
        if (err || !account) {
          reject(err);
        } else {
          resolve(account);
        }
      });
    });

    return prom;
  }

  getAllOnline(cb) {
    this.collection.find({online: true}).toArray(cb);
  }

  getAll(cb) {
    const prom = new Promise((resolve, reject) => {
      this.collection.find({}).toArray((err, array) => {
        if (err) {
          reject(err);
        } else {
          resolve(array);
        }
      });
    });

    return prom;
  }
}
