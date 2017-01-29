'use strict'

import multer from 'multer';

class FileStore {
  constructor() {

  }

  createMulter(destDir) {
    return multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, destDir);  
      },
      filename: function (req, file, callback) {
        callback(null, req.query.id);
      }
    });
  }

  create(destDir) {
    return multer({
      storage: createMulter(destDir),
      limits: {
        fileSize: 100000000
      }
    }).single('file');
  } 
}