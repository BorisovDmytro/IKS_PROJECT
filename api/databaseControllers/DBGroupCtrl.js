"use strict"

/**
 *  _id
 *  name
 *  owner
 *  users = []
 */
const ObjectID   = require('mongodb').ObjectID;

export default class DBGroupCtrl {
  constructor(db) {
    this.collection = db.collection('group');  
  }

  add(name, owner, cb) {
this.collection.findOne({ $or: [{ name: name }, { owner: owner }] }, (err, doc) => {
  if(doc) {
    cb("data-token");
  } else {
      var group = {
          
          name:   name,
          owner:  owner,
          users: users[] //???
      };
      this.collection.insert(group, { safe: true }, (err, res) => {
          if (err)
            cb(err);
          else
            cb(null, res.ops[0]);
        });
  }

});
  }
 //jjjjjjjjjjjjvj
  update(id, obj, cb) {
    this.collection.findOne({_id: ObjectID(id)}, (err, doc) => {
            if(err) {
        cb("not found");
      } else {
        doc.id     = id     || doc.id;
        doc.name      = name      || doc.email;
        doc.owner     = owner     || doc.owner;
        //doc.users[]     = users[]     || doc.users[];
        doc.users.unshift(users) || doc.users[];//???

        this.collection.save(doc, { safe: true }, (err) => {
          if(err)
            cb("error save");
          else 
            cb(null, doc);
        });        
      }
    });
  }

  removeById(id, cb) {
this.collection.remove({ _id: new ObjectID(id) }, cb);
  }

  removeByName(name, cb) {
this.collection.findOne.remove({name: name}, cb);
  }

  getById(id, cb) {
 this.collection.findOne({_id: new ObjectID(id)}, cb);
  }

  getByName(name, cb) {
    this.collection.findOne({name: name}, cb);
  }

}
