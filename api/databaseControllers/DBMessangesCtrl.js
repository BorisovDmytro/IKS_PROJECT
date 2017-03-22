"use strict"

import moment from 'moment';

moment.locale('ru');

export default class DBMessangesCtrl {
  constructor(db) {
    this.collection = db.collection('messanges');
    this.limit = 50;
  }

  add(msg, groupName, owner, to, from, fileLink) {
    const data = {
      messages: msg,
      group: groupName,
      owner: owner,
      to: to,
      from: from,
      fileLink: fileLink || null,
      date: moment().format('l') + "\n" + moment().format('LT'),
    };

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

  getPrivateMessages(userOne, userTwo, cursore) {
    const prom = new Promise((resolve, reject) => {
      const file = { $or: [{ to: userOne, from: userTwo }, { to: userTwo, from: userOne }] };

      const count = this.collection.find(file).count();
      let next = count - (cursore + 1) * this.limit;
      next = next < 0 ? 0 : next;
      this.collection
        .find(file)
        .skip(next)
        .limit(this.limit)
        .toArray((err, arr) => {
          if (err)
            reject(err);
          else
            resolve(arr);
        });
    });

    return prom;
  }

  getGroupMessages(groupName, cursore) {
    const prom = new Promise((resolve, reject) => {
      const count = this.collection.count(); // TODO calck using group name
      let next = count - (cursore + 1) * this.limit;
      next = next < 0 ? 0 : next;

      this.collection
        .find({ group: groupName })
        .skip(next)
        .limit(this.limit)
        .toArray((err, arr) => {
          if (err)
            reject(err);
          else
            resolve(arr);
        });
    });

    return prom;
  }
  // TODO ADD remove and auto clear skript
}

