"use strict"

const express      = require('express');
const http         = require('http');
const config       = require('./config');
const bodyParser   = require('body-parser');
const morgan       = require('morgan');

const DbFactory         = require("./utils/DBControllerFactory");
const DbConnector       = require("./databaseControllers/DBConnector");
const ControllerFactory = require("./utils/ControllerFactory");

const app          = express();
const httpServer   = http.createServer(app)

const connector = new DbConnector();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/html/index.html");
});

connector.connect(config("dbUrl"), (db) => {
  const dbAccountCtrl = DbFactory.createAccountCtrl(db);
  const dbMgsCtrl     = DbFactory.createMessangesCtrl(db);

  const authCtrl = ControllerFactory.createAuthCtrl(dbAccountCtrl);
  const messenger = ControllerFactory.createMessengerController(httpServer, dbMgsCtrl); 

  app.post("/auth", authCtrl.login.bind(authCtrl));
  app.put("/auth",  authCtrl.signUp.bind(authCtrl));

  httpServer.listen(config('port', 8080), config('ip', '127.0.0.1'), () => {});
});

/*
   // TODO REMOVE AFTER RELISE 
    console.log("Run test");
    dbAccountCtrl.insert("test@gmail.com", "nikName", "695dsa49700", (err, doc) => {
      console.log("Res:", doc);
    });
    console.log("Test finished");
*/