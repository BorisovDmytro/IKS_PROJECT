'use strict'

class AuthCtrl extends IController {
  constructor(authService) {
    super();

    this.authService = authService;
    this.isLogin = true;

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

  onSubmite() {
    let self = this;

    if (this.isLogin) {
      // TODO CHEACK LOGIN MODEL
      this.authService.login(this.loginModel, (err) => {
        if (err) {
          // TODO SHOW ERROR
          console.error(err);
        } else {
          console.log("Account", self.authService.getAccount());
          window.location = "/#!/main";
        }
      });
    } else {
       // TODO CHEACK SIGNUP MODEL
      this.authService.signUp(this.signUpModel, (err) => {
        if(err) 
          console.error(err);
        else {
          self.isLogin = true;
        }  
      });
    }
  }
}

const configAuthCtrl = {
  controller: AuthCtrl,
  templateUrl: "componnet/AuthComponnet/AuthTemplate.html"
};

angular.module("App").component("auth", configAuthCtrl);
