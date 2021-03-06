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
app.use('/', Express.static(__dirname + "/web/build/lib"));
app.use('/', Express.static(__dirname + "/web/build/css"));
app.use('/', Express.static(__dirname + "/web/build/images"));
app.use('/', Express.static(__dirname + "/admin"));
app.use('/', Express.static(__dirname + "/admin/html/index.html"));

connector.connect(config("dbUrl"), (db) => {
  const dbAccountCtrl = DbFactory.createAccountCtrl(db);
  const dbMgsCtrl     = DbFactory.createMessangesCtrl(db);

  const authCtrl      = ControllerFactory.createAuthCtrl(dbAccountCtrl);

  app.get('/', (req, res) => res.sendFile(__dirname + "/admin/html/index.html"));

  app.put("/auth",  authCtrl.signUp.bind(authCtrl));
  app.get('/accounts', authCtrl.getAccounts.bind(authCtrl));

  httpServer.listen(config('port_admin', 8080), config('id_admin', '127.0.0.1'), () => {
    console.log(`Server start done ... `);
  });
});


