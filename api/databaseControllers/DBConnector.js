"use strict"

import Mongodb from 'mongodb';

const MongoClient = Mongodb.MongoClient;

export default class DBConnector {
  constructor() {
    this.client = null;
  }

  connect(url, cb) {
    MongoClient.connect(url, (err, db) => {
      if (err)
        console.error(err);
      else {
        this.client = db;
        console.log('connected to database ::', db.databaseName);
        cb(this.client);
      }
    });
  }
  
  close() {
    this.client.close();
  }
}

module.exports = DBConnector;

