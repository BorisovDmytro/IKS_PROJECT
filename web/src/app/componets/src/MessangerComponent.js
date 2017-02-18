'use strict';
export default (app) => {
  class MessangerComponent {
    constructor(authService, messangerService, $timeout) {
      this.authService      = authService;
      this.messangerService = messangerService;
      this.timeout          = $timeout;
      this.messages         = "";
      this.model            = [];
    }

    initialize() {
      this.messangerService.setListener('history', (data) => {
        this.model = data;
        this.timeout(() => this.animatedScrollDown(100, 0), 10);
      });

      this.messangerService.setListener('private', (data) => {
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

    logOut() {
      window.location.reload();
    }

    updateGroupClients() {
      const account = this.authService.getAccount();
      this.messangerService.getGroupClients("Public", (err, data) => {
          
          console.log("getGroupClients:", data);
          for(let i = 0; i < data.length; i ++) {
            if(data[i].id == account.id) {
              data.splice(i, 1);
              break;
            }
          }

          this.timeout(() => this.users = data, 10);
        });
    }

    send() {
      if (this.messages && this.messages.length > 0) {
        const account = this.authService.getAccount();
        console.log('SEND', this.messages);

        if (this.mIsGroup) {
          console.log('Send to group ');
          this.messangerService.send(account.name, "Public", "", account.id, this.messages);
          this.messages = "";
        } else {
          console.log('Send to private ');
          this.messangerService.send(account.name, "", this.toUser.id, account.id, this.messages);
          this.messages = "";
        }
      }
    }

    animatedScrollDown(animationTime, waitTime) {
      this.timeout(() => {
        $('#msgBody').stop().animate({
          scrollTop: $("#msgBody")[0].scrollHeight
        }, animationTime);
      }, waitTime);
    }

    onGroupCLick(groupName) {
      const account     = this.authService.getAccount();
      this.currentGroup = groupName;
      this.messangerService.getHistory(groupName, 0, account.id);
      this.toUser = null;
    }

    onUserCLick(user) {
      const account     = this.authService.getAccount();
      this.toUser       = user;
      this.currentGroup = null;
      this.messangerService.getPrivate(this.toUser.id, account.id);
    }
  }

  const config = {
    controller: MessangerComponent,
    templateUrl: "html/MessangerTemplate.html"
  };

  app.component("messanger", config);
}




