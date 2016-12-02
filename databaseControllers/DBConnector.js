"use strict"

const MongoClient = require('mongodb').MongoClient;

class DBConnector {
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
        cb(db);
      }
    });
  }

  close() {
    this.client.close();
  }
}

module.exports = DBConnector;