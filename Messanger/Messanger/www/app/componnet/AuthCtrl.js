'use strict'

function AuthCtrl(authService) {
  this.authService = authService;
  this.isLogin = true;
  this.isLoginError = false;

  this.loginModel = {
    email: "",
    pass: ""
  };

  this.signUpModel = {
    email: "",
    name: "",
    pass: ""
  };

}

AuthCtrl.prototype.onSubmite = function () {
  var self = this;

  if (this.isLogin) {
    // TODO CHEACK LOGIN MODEL
    this.authService.login(this.loginModel, function(err) {
      if (err) {
        // TODO SHOW ERROR
        self.isLoginError = true;
        console.error(err);
      } else {
        console.log("Account", self.authService.getAccount());
        //window.location = "/#!/main";
      }
    });
  } else {
    // TODO CHEACK SIGNUP MODEL

    this.authService.signUp(this.signUpModel, function (err) {
      if (err)
        console.error(err);
      else {
        self.isLogin = true;
      }
    });
  }
}


var configAuthCtrl = {
  controller: AuthCtrl,
  templateUrl: "html/AuthTemplate.html"
};

angular.module("app").component("auth", configAuthCtrl);
