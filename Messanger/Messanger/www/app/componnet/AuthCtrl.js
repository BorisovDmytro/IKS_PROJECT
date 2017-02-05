'use strict'

function AuthCtrl(authService, $timeout) {
  this.authService = authService;
  this.isLogin = true;
  this.isLoginError = false;

  this.loginModel = {
    email: "111@gmail.com",
    pass: "123456"
  };

  this.visible = true;
  //
  window.addEventListener('resize', this.onInit);
}

AuthCtrl.prototype.onInit = function () {
  var h = window.innerHeight;
  var w = window.innerWidth;
  var style = {};
  if (w > h) {
    $('#auth').attr('style', 'font-size: 26px; height: 100vh; margin: 0px;');
  } else {
    $('#auth').attr('style', 'font-size: 26px; height: 100vh; margin: 0px; padding-top: 20%; padding-bottom: 20%;');
  }
}

AuthCtrl.prototype.onSubmite = function () {
  var self = this;

  this.authService.login(self.loginModel, function (err) {
    if (err) {
      // TODO SHOW ERROR
      self.isLoginError = true;
      console.error(err);
    } else {
      console.log("Account", self.authService.getAccount());
      self.visible = false;
      self.authService.cbLoginSuccess();
      //window.location = "/#!/main";
    }
  });
 
}


var configAuthCtrl = {
  controller: AuthCtrl,
  templateUrl: "html/AuthTemplate.html"
};

angular.module("app").component("auth", configAuthCtrl);
