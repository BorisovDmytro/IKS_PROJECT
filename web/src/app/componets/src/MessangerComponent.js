'use strict';

import FileUploder from './../../utils/FileUplouder';

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

      const fileInpt = document.getElementById('fileInpt');

      fileInpt.onchange = () => {
        console.log(fileInpt.files);
        if (fileInpt.files.length == 0)
          return;
        this.onUploadFile(fileInpt.files[0]);
      }
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
        const fileLink = this.uploadFileData ? `/download/${this.uploadFileData.name}?id=${this.uploadFileData._id}` : null;

        if (this.mIsGroup) {
          console.log('Send to group ');
          this.messangerService.send(account.name, "Public", "", account.id, this.messages, fileLink);
          this.messages = "";
        } else {
          console.log('Send to private ');
          this.messangerService.send(account.name, "", this.toUser.id, account.id, this.messages, fileLink);
          this.messages = "";
        }

        if (this.uploadFileData) {
           this.timeout(() => {
            this.uploadFileData = null;
          });
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

    onUploadFile(file) {
      const account     = this.authService.getAccount();
      const url = `/file?name=${file.name}&size=${file.size}&owner=${account.name}`;

      const uploader = new FileUploder(url);
      
      uploader.onError((err) => {
        console.error("File upload error:", err);
      })

      uploader.onProgress((event) => {
        this.timeout(() => {
          this.messages = `Файл загружается ... ${(event.loaded / event.total).toFixed(0)}`;
        });
        console.log('Progress', event.loaded / event.total);
      });

      uploader.onReadyState((state, result) => {
        if (state == 4) {
          console.log('Resualt:', result);
          this.uploadFileData = JSON.parse(result);
          this.timeout(() => {
            this.messages = `Файл ${this.uploadFileData.name}`;
          });
        }
      });

      uploader.send(file);
    }
  }

  const config = {
    controller: MessangerComponent,
    templateUrl: "html/MessangerTemplate.html"
  };

  app.component("messanger", config);
}




