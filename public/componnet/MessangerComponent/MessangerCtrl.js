'use strict';

class MessangerCtrl extends IController {
  constructor(authService, messangerService, $timeout) {
    super();

    this.authService      = authService;
    this.messangerService = messangerService;
    this.timeout          = $timeout;
    this.messages         = "";
    this.model            = [];
  }

  initialize () {
    this.messangerService.setListener('history', (data) => {
      this.model = data;
      this.timeout(() => this.animatedScrollDown(100, 0), 10);
    });

    this.messangerService.setListener('newMessage', (data) => {
      this.model.push(data);
      this.animatedScrollDown(200, 0);
    });

    this.messangerService.setListener('changeOnline', (data) => {
      console.log("changeOnline", data);
      this.timeout (() => this.online = data, 10);
    });

    let account = this.authService.getAccount();
    if(!account) {
      window.location = "/";
      return;
    }

    this.nikname = account.name;
    this.messangerService.initialize(account, (err) => {
      if(err) {
        window.location = "/";
      } else  {
        this.messangerService.getOnlineByGroup("Public", (err, data) => {
          console.log("getOnlineByGroup", data);
          this.online = data;
        });
      }
    });
  }

  send() {
    if(this.messages && this.messages.length > 0) {
      const account = this.authService.getAccount();
      console.log('SEND', this.messages);
      this.messangerService.send(account.name, "Public", this.messages);
      this.messages = "";
    }
  }

  animatedScrollDown(animationTime, waitTime) {
    this.timeout(() => {
      $('#msgBody').stop().animate({
        scrollTop: $("#msgBody")[0].scrollHeight
      }, animationTime);
    }, waitTime);
  }
}

const configMessangerCtrl = {
  controller: MessangerCtrl,
  templateUrl: "componnet/MessangerComponent/MessangerTemplate.html"
};

angular.module("App").component("messanger", configMessangerCtrl);
