"use strict"

import FileStore from './../utils/FileStore';
import path      from 'path';

export default class FileCtrt {
  constructor(uploadPath, dbFileCtr) {
    this.dbFileCtr  = dbFileCtr;
    this.fileStore  = new FileStore().create(uploadPath);
    this.uploadPath = uploadPath;
  }

  upload(req, res) {
    const name  = req.query.name;
    const size  = req.query.size;
    const owner = req.query.owner;

    this.dbFileCtr.insert(name, size, owner)
    .then((doc) => {
      req.query.id = doc._id;
      this.fileStore(req, res, (err, dis) => {
        if (!err) {
          res.status(200).send(doc);
        } else {
          res.status(405).send('Err:'+ err)
        }
      });
    })
    .catch((err) => res.status(405).send('Err:'+ err));;
  }
  // /download/{{desc.name}}?id={{desc._id}}
  downloads(req, res) {
    const id = req.query.id;
    console.log('#ID', id);
    this.dbFileCtr.getById(id)
    .then((doc) => {
      console.log('#FIND', id, path.join(this.uploadPath, id));
      res.status(200).sendFile(path.join(this.uploadPath, id));
    })
    .catch((err) => res.status(400).send('Not found: ' + err));
  }
}