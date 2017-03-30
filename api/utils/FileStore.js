'use strict'

import multer from 'multer';

export default class FileStore {
  constructor() {
    
  }

  _createMulter(destDir) {
    return multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, destDir);  
      },
      filename: function (req, file, callback) {
        callback(null, req.query.id.toString());
      }
    });
  }

  create(destDir) {
    return multer({
      storage: this._createMulter(destDir),
      limits: {
        fileSize: 100000000
      }
    }).single('file');
  } 
  
}