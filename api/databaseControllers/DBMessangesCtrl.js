"use strict"

import moment from 'moment';

moment.locale('ru');

export default class DBMessangesCtrl {
  constructor(db) {
    this.collection = db.collection('messanges');
    this.limit = 50;
  }

  add(msg, groupName, owner, to, from, cb) {
    const data = {
      messages: msg,
      group:    groupName,
      owner:    owner,
      to:       to,  
      from:     from,
      date:     moment().format('MMMM Do YYYY, h:mm:ss a'),
    };

    this.collection.insert(data, { safe: true },
      (err, res) => {
        if (err)
          cb(err);
        else
          cb(null, res.ops[0]);
      });
  }

  getPrivateMessages(userOne, userTwo, cursore, cb) {
    const file = {$or: [{to : userOne, from: userTwo}, {to : userTwo, from: userOne}]};

    const count = this.collection.find(file).count();
    let next   = count - (cursore + 1) * this.limit;
    next = next < 0 ? 0 : next;
    this.collection.find(file).skip(next).limit(this.limit).toArray(cb);
  }

  getGroupMessages(groupName, cursore, cb) {
    const count = this.collection.count(); // TODO calck using group name
    let next    = count - (cursore + 1) * this.limit;
    next = next < 0 ? 0 : next;

    this.collection.find({group: groupName}).skip(next).limit(this.limit).toArray(cb);   
  }
  // TODO ADD remove and auto clear skript
}

