"use strict"

import FileStore from './../utils/FileStore';

class FileCtrt {
  constructor(uploadPath) {
    this.fileStore = new FileStore().create(uploadPath);
  }

  upload(req, res) {
    // TODO SAVE IN DB
    this.fileStore(req, res);
  }

  downloads(req, res) {

  }
}