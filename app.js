'use strict'

import Express    from 'express';
import Http       from 'http';
import config     from './config.js';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import path       from 'path';
import fs         from "fs-extra"

import DbFactory         from "./api/utils/DBControllerFactory";
import DbConnector       from "./api/databaseControllers/DBConnector";
import ControllerFactory from "./api/utils/ControllerFactory";

function createUplaodDir(path) {
  let status;
  try {
    status = fs.statSync(path);
  } catch(exp) {
    status = null;
  }
  
  if (!status) {
    try {
      fs.mkdirSync(path);
    } catch(exp) {
      console.error("Error create upload dir, check your config file and path to upload directory and try again");
    }
  }
}

const app          = Express();
const httpServer   = Http.createServer(app);
const connector    = new DbConnector();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', Express.static(__dirname + "/web/build"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/web/build/html/index.html");
});

connector.connect(config("dbUrl"), (db) => {
  const uplaodDir = config("uplaodDir", __dirname + "/uplaod");

  createUplaodDir(uplaodDir);

  const dbAccountCtrl = DbFactory.createAccountCtrl(db);
  const dbMgsCtrl     = DbFactory.createMessangesCtrl(db);
  const dbFileCtrl    = DbFactory.createFileCtrl(db);
  const dbGroupCtrl   = DbFactory.createGroupCtrl(db);

  const authCtrl  = ControllerFactory.createAuthCtrl(dbAccountCtrl);
  const messenger = ControllerFactory.createMessengerController(httpServer, dbMgsCtrl, dbAccountCtrl); 
  const fileCtrl  = ControllerFactory.createFileController(uplaodDir, dbFileCtrl);
  const groupCtrl = ControllerFactory.createGroupApiController(dbGroupCtrl, dbAccountCtrl);

  app.post("/auth", authCtrl.login.bind(authCtrl));
  app.put("/auth" , authCtrl.signUp.bind(authCtrl));

  app.post('/file'         , fileCtrl.upload.bind(fileCtrl));
  app.get('/download/:name', fileCtrl.downloads.bind(fileCtrl));

  app.get('/group'   , groupCtrl.getAccountGroup.bind(groupCtrl));
  app.put('/group'   , groupCtrl.addGroup.bind(groupCtrl));
  app.post('/group'  , groupCtrl.addUserToGroup.bind(groupCtrl));
  app.delete('/group', groupCtrl.removeUserFromGroup.bind(groupCtrl));

  httpServer.listen(config('port', 8080), config('ip', '127.0.0.1'), () => {
    console.log(`Server start done ... `);
  });
});


