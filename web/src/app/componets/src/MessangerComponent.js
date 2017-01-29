'use strict';
export default (app) => {
  class MessangerComponent {
    constructor(authService, messangerService, $timeout) {
      this.authService = authService;
      this.messangerService = messangerService;
      this.timeout = $timeout;
      this.messages = "";
      this.model = [];
    }

    initialize() {
      this.messangerService.setListener('history', (data) => {
        this.model = data;
        this.timeout(() => this.animatedScrollDown(100, 0), 10);
      });

      this.messangerService.setListener('newMessage', (data) => {
        this.model.push(data);
        this.animatedScrollDown(200, 0);
      });

      let account = this.authService.getAccount();
      if (!account) {
        window.location = "/";
        return;
      }

      this.nikname = account.name;
      this.messangerService.initialize(account, (err) => {
        if (err) {
          window.location = "/";
        } else {
          this.updateGroupClients();
          setInterval(this.updateGroupClients.bind(this), 4000);
        }
      });
    }

    updateGroupClients() {
      this.messangerService.getGroupClients("Public",
        (err, data) => {
          this.timeout(() => {
            console.log("getGroupClients:", data);
            this.online = data;
          }, 0);
        });
    }

    send() {
      if (this.messages && this.messages.length > 0) {
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

  const config = {
    controller: MessangerComponent,
    templateUrl: "html/MessangerTemplate.html"
  };

  app.component("messanger", config);
}




