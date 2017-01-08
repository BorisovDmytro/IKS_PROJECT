'use strict'

class AuthService extends IController{
  constructor($http) {
    super();
    this.account = null;
    this.http = $http;
  }

  login(model, cb) {
    let self = this;

    this.http({
      method: 'POST',
      url: '/auth',
      data: model
    }).then(function (answ) {
      self.account = answ.data;
      cb(null);
    }, function (err) {
      self.account = null;
      cb(err);
    });
  }

  signUp(model, cb) {
    this.http({
      method: 'PUT',
      url: '/auth',
      data: model 
    }).then(function (answ) {
      // ok
      cb(null, answ.data); // success
    }, function (err) {
      // err
      cb(err);
    });
  }

  getAccount() {
    return this.account;
  }
}

angular.module("App").service("authService", AuthService);
