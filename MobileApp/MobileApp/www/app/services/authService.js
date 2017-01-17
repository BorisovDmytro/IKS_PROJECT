'use strict'


function AuthService($http, configService) {
  this.account = null;
  this.http = $http;
  this.configService = configService;
}

AuthService.prototype.login = function (model, cb) {
  var self = this;

  this.http({
    method: 'POST',
    url: this.configService.url + '/auth',
    data: model
  }).then(function (answ) {
    self.account = answ.data;
    cb(null);
  }, function (err) {
    self.account = null;
    cb(err);
  });
}

AuthService.prototype.login = function (model, cb) {
  this.http({
    method: 'PUT',
    url: this.configService.url + '/auth',
    data: model
  }).then(function (answ) {
    // ok
    cb(null, answ.data); // success
  }, function (err) {
    // err
    cb(err);
  });
}

AuthService.prototype.getAccount = function () {
  return this.account;
}


angular.module("app").service("authService", AuthService);
