"use strict"

/**
 *  _id
 *  name
 *  owner
 *  users = []
 */
const ObjectID = require('mongodb').ObjectID;

export default class DBGroupCtrl {
  constructor(db) {
    this.collection = db.collection('group');
  }

  add(name, owner) {
    const promise = new Promise((resolve, reject) => {
      this.collection.findOne({ $or: [{ name: name }, { owner: owner }] }, (err, doc) => {
        if (doc) {
          cb("data-token");
        } else {
          var group = {
            name: name,
            owner: owner,
            users: [owner]
          };
          this.collection.insert(group, { safe: true }, (err, res) => {
            if (err)
              reject(err);
            else
              resolve(null, res.ops[0]);
          });
        }

      });
    });

    return promise;
  }

  update(id, obj) {
    const promise = new Promise((res, rej) => {
      this.collection.findOne({ _id: ObjectID(id) }, (err, doc) => {
        if (err) {
          cb("not found");
        } else {
          doc.name  = obj.name || doc.email;
          doc.owner = obj.owner || doc.owner;
          doc.users = obj.users || doc.users;

          this.collection.save(doc, { safe: true }, (err) => {
            if (err)
              cb("error save");
            else
              cb(null, doc);
          });
        }
      });
    });

    return promise;
  }

  removeById(id) {
    const promise = new Promise((resolve, reject) => {
      this.collection.remove({ _id: new ObjectID(id) }, (err) => {
        if (err)
          reject(err);
        else
          resolve();
      });
    });

    return promise;
  }

  removeByName(name, cb) {
    const promise = new Promise((resolve, reject) => {
      this.collection.remove({ name: name }, (err) => {
        if (err)
          reject(err);
        else
          resolve();
      });
    });

    return promise;
  }

  getById(id) {
    const promise = new Promise((res, rej) => {
      this.collection.findOne({ _id: new ObjectID(id) }, (err, obj) => {
        if (err)
          rej(err);
        else
          res(obj);
      });
    });

    return promise;
  }

  getByUser(id) {
    const promise = new Promise((res, rej) => {
      this.collection.find({$in: [id]}, (err, groups) => {
        if (err) {
          rej(err);
        } else {
          res(groups);
        }
      });
    });

    return promise;
  }

  getByName(name, cb) {
    const promise = new Promise((res, rej) => {
      this.collection.findOne({ name: name }, (err, obj) => {
        if (err)
          rej(err);
        else
          res(obj);
      });
    });

    return promise;
  }
}
