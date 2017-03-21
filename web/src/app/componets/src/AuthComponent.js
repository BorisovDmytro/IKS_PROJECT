'use strict'

export default (app) => {

  class AuthComponent {
    constructor(authService) {
      this.authService  = authService;
      this.isLogin      = true;
      this.isLoginError = false;

      this.loginModel = {
        email: "444@gmail.com",
        pass: "695497"
      };
    }

    onSubmite() {
      if (this.isLogin) {
        // TODO CHEACK LOGIN MODEL
        var resultM = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.loginModel.email);
        var resultP = /^[A-Za-z0-9]{3,18}$/.test(this.loginModel.pass);
        if(resultM == false && resultP == false) {
          this.isLoginError = true;
        }
        this.authService.login(this.loginModel, (err) => {
          if (err) {
            // TODO SHOW ERROR
            this.isLoginError = true;
            console.error(err);
            
          } else {
            console.log("Account", this.authService.getAccount());
            window.location = "/#!/main";
          }
        });
      } 
    }
  }

  const config = {
    controller: AuthComponent,
    templateUrl: "html/AuthTemplate.html"
  };


  app.component("auth", config);
};




