'use strict'

function AuthService($http, configService) {
  console.log("Create service AuthService");
  this.http = $http;
  this.configService = configService;
}

AuthService.prototype.setLoginSuccessFullCallBack = function(cb) {
  this.cbLoginSuccess = cb;
}

AuthService.prototype.login = function (model, cb) {
  var self = this;

  var url = this.configService.absUrl + '/auth';
  console.log(model, url);
  this.http({
    method: 'POST',
    url: url,
    data: model
  }).then(function (answ) {
    self.account = answ.data;
    console.log("Save account", self.account);
    cb(null);
  }, function (err) {
    console.log("Error account");
    self.account = null;
    cb(err);
  });
}

AuthService.prototype.getAccount = function () {
  return this.account;
}

angular.module("app").service("authService", AuthService);
