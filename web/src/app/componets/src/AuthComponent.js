'use strict'

export default (app) => {

  class AuthComponent {
    constructor(authService) {
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

    onSubmite() {
      if (this.isLogin) {
        // TODO CHEACK LOGIN MODEL
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
      } else {
        // TODO CHEACK SIGNUP MODEL
        this.authService.signUp(this.signUpModel, (err) => {
          if (err)
            console.error(err);
          else {
            this.isLogin = true;
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




