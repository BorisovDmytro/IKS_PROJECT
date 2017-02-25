'use strict'

import Express    from 'express';
import Http       from 'http';
import config     from './config.js';
import bodyParser from 'body-parser';
import morgan     from 'morgan';
import path       from 'path';

import DbFactory         from "./api/utils/DBControllerFactory";
import DbConnector       from "./api/databaseControllers/DBConnector";
import ControllerFactory from "./api/utils/ControllerFactory";

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
  const uplaodDir = path.join(__dirname, 'upload');

  const dbAccountCtrl = DbFactory.createAccountCtrl(db);
  const dbMgsCtrl     = DbFactory.createMessangesCtrl(db);
  const dbFileCtrl    = DbFactory.createFileCtrl(db);

  const authCtrl  = ControllerFactory.createAuthCtrl(dbAccountCtrl);
  const messenger = ControllerFactory.createMessengerController(httpServer, dbMgsCtrl, dbAccountCtrl); 
  const fileCtrl  = ControllerFactory.createFileController(uplaodDir, dbFileCtrl);

  app.post("/auth", authCtrl.login.bind(authCtrl));
  app.put("/auth",  authCtrl.signUp.bind(authCtrl));

  app.post('/file',          fileCtrl.upload.bind(fileCtrl));
  app.get('/download/:name', fileCtrl.downloads.bind(fileCtrl));

  httpServer.listen(config('port', 8080), config('ip', '127.0.0.1'), () => {
    console.log(`Server start done ... `);
  });
});


