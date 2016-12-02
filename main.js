"use strict"

const express      = require('express');
const http         = require('http');
const config       = require('./config');
const bodyParser   = require('body-parser');
const morgan       = require('morgan');

const app        = express();
const httpServer = http.createServer(app)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', express.static("./public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/html/index.html");
});

httpServer.listen(config('port', 8080), config('ip', '127.0.0.1'));
