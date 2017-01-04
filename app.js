'use strict'

import Express    from 'express';
import Http       from 'http';
import config     from './config.js';
import bodyParser from 'body-parser';
import morgan     from 'morgan';

import DbFactory         from "./api/utils/DBControllerFactory";
import DbConnector       from "./api/databaseControllers/DBConnector";
import ControllerFactory from "./api/utils/ControllerFactory";

const app          = Express();
const httpServer   = Http.createServer(app);
const connector    = new DbConnector();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', Express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/html/index.html");
});

connector.connect(config("dbUrl"), (db) => {
  const dbAccountCtrl = DbFactory.createAccountCtrl(db);
  const dbMgsCtrl     = DbFactory.createMessangesCtrl(db);

  const authCtrl  = ControllerFactory.createAuthCtrl(dbAccountCtrl);
  const messenger = ControllerFactory.createMessengerController(httpServer, dbMgsCtrl); 

  app.post("/auth", authCtrl.login.bind(authCtrl));
  app.put("/auth",  authCtrl.signUp.bind(authCtrl));

  httpServer.listen(config('port', 8080), config('ip', '127.0.0.1'), () => {
    console.log(`Server start done ... `);
  });
});


