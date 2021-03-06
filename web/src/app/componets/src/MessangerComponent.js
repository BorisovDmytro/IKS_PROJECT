'use strict';

import FileUploder from './../../utils/FileUplouder';

export default (app) => {
  class MessangerComponent {
    constructor(authService, messangerService, $timeout, groupService) {
      this.groupService     = groupService;
      this.authService      = authService;
      this.messangerService = messangerService;
      this.timeout          = $timeout;
      this.messages         = "";
      this.model            = [];
      this.users            = [];

      this.poolingTimeOut   = 2000; //RELEASE 60 000 * 5
    }

    initialize() {
      let touchStrtX = 0;
      
      window.ontouchstart = (event) => {
        console.log('ontouchstart',event);
        touchStrtX = event.screenX;
      }

      window.ontouchend = (event) => {
        console.log('ontouchend',event);
        let x = event.screenX;

        if (x < touchStrtX) { // left
          this.timeout(() => this.SideBar = false, 10);
        } 

        if (x > touchStrtX) { // right
          this.timeout(() => this.SideBar = true, 10);
        }
       
      }

      this.messangerService.setListener('history', (data) => {
        this.model = data;
        this.timeout(() => this.animatedScrollDown(100, 0), 10);
      });

      this.messangerService.setListener('private', (data) => {
        this.model = data;
        this.timeout(() => this.animatedScrollDown(100, 0), 10);
      });

      this.messangerService.setListener('newMessage', (data) => {
        if (this.toUser) {
          if (data.from != this.toUser.id && data.to != this.toUser.id) {
            return;
          }
        } else { // Group
          if (data.group != this.currentGroup.name) {
            return;
          }
        }
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
          setInterval(this.updateGroupClients.bind(this), this.poolingTimeOut);
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

      this.groupService.getAccountGroup(account.id, (err, res) => {
        console.log('$$$RES', res);
        this.timeout(() => {
            this.groups = res;
            //this.updateUnread();
          }, 10);
      });
      // TODO RENAME GET ALL account
      this.messangerService.getGroupClients("Public", (err, data) => {
          console.log("getGroupClients:", data);
          for(let i = 0; i < data.length; i ++) {
            if(data[i].id == account.id) {
              data.splice(i, 1);
              break;
            } else if (this.toUser && data[i].id == this.toUser.id) {
              this.toUser = data[i];
            }
            data[i].isHaveUnread = false;
          }
          
          this.timeout(() => {
            this.users = data;
            this.updateUnread();
          }, 10);
        });
    }

    updateUnread() {
      const account = this.authService.getAccount();

      this.messangerService.getUnread(account.id, (err, unread) => {
        this.timeout(() => {
          for (let user of this.users) {
            for (let unrd of unread) {
              if (user.id == unrd.id) {
                user.isHaveUnread = true;
                break;
              }
            }
          }

          console.log("#Unread", unread);
        }, 10);
      });
    }

    send() {
      if (this.messages && this.messages.length > 0) {
        const account = this.authService.getAccount();
        console.log('SEND', this.messages);
        const fileLink = this.uploadFileData ? `/download/${this.uploadFileData.name}?id=${this.uploadFileData._id}` : null;

        if (this.mIsGroup) {
          console.log('Send to group ', this.currentGroup);
          this.messangerService.send(account.name, this.currentGroup.name, "", account.id, this.messages, fileLink);
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
      this.messangerService.getHistory(groupName.name, 0, account.id);
      this.toUser = null;
      this.SideBar = false;
    }

    onUserCLick(user) {
      const account     = this.authService.getAccount();
      this.toUser       = user;
      this.currentGroup = null;
      if (user.isHaveUnread) {
        this.messangerService.setRead(account.id, user.id);
        this.updateUnread();
      }
      this.messangerService.getPrivate(this.toUser.id, account.id);
      this.SideBar = false;
    }

    onMessageViewOver() {
      console.log('$onMessageViewOver', this.toUser);
      if (this.toUser && this.toUser.isHaveUnread) {
        const account = this.authService.getAccount();
        this.messangerService.setRead(account.id, this.toUser.id);
        this.toUser.isHaveUnread = false;
      }
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

    onShowAddGroup() {
      this.accounts = this.users;
      this.crtGroupUser = [];
    }

    onAddToGroup(item) {
      this.crtGroupUser.push(item.id);
    }

    onRemoveFromGroup(index) {
      this.crtGroupUser.splice(index, 1);
    }

    onSubmitGroup() {
      console.log(this.crtGroupName, this.crtGroupUser);
      const account = this.authService.getAccount();
      //addGroup(id, name, users, cb)
      //TODO CHECK crtGroupUser if EMPTY MOT CREATE
      this.groupService.addGroup(account.id, this.crtGroupName, this.crtGroupUser,
       (err) => {
        if (err) 
          console.error(err);
        else {
          this.crtGroupUser = [];
          this.crtGroupName = "";
        }
      });
    }
  }

  const config = {
    controller: MessangerComponent,
    templateUrl: "html/MessangerTemplate.html"
  };

  app.component("messanger", config);
}




