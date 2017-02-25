"use strict"

import moment     from 'moment';
import Mongodb    from 'mongodb';
import Encryption from './../utils/Encryption.js';

const ObjectID = Mongodb.ObjectID;

//_id ( auto gen)
//name
//size
//owner

export default class DBFileCtrl {
  constructor(db) {
    this.collection = db.collection('files');
  }

  insert(name, size, owner) {
    const data = {
      name: name,
      size: size,
      owner: owner 
    }

    const promise = new Promise((resolve, reject) => {
      this.collection.insert(data, { safe: true },
        (err, res) => {
          if (err)
            reject(err);
          else
            resolve(res.ops[0]);
        });
    });

    return promise;
  }

  update(id, obj) {
    const prom = new Promise((resolve, reject) => {

      this.collection.findOne({ _id: ObjectID(id) }, (err, doc) => {
        if (err) {
          reject("not found");
        } else {
          doc.email = obj.name  || doc.name;
          doc.name  = obj.size  || doc.size;
          doc.pass  = obj.owner || doc.owner;
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

  remove(id) {
    
  }

  getById(id) {
    const promise = new Promise((resolve, reject) => {
      this.collection.findOne({_id: new ObjectID(id)}, (err, doc) => {
        if (err) {
          reject (err);
        } else {
          resolve (doc);
        }
      });
    });

    return promise;
  }
}

