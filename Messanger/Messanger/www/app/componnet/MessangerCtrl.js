function MessangerCtrl(authService, messangerService, $timeout) {
  this.authService = authService;
  this.messangerService = messangerService;
  this.timeout = $timeout;
  this.messages = "";
  this.model = [];

  this.visible = false;

  var self = this;
  authService.setLoginSuccessFullCallBack(function () {
    console.log('setLoginSuccessFullCallBack');
    self.visible = true;

    self.initialize();
  });
}

MessangerCtrl.prototype.initialize = function () {
  var self = this;

  this.messangerService.setListener('history', function (data) {
    self.model = data;
    self.timeout(function () { self.animatedScrollDown(100, 0); }, 10);
  });

  this.messangerService.setListener('newMessage', function (data) {
    self.model.push(data);
    self.animatedScrollDown(200, 0);
  });

  var account = this.authService.getAccount();

  console.log('Get account', account, this.authService);

  if (!account) {
    window.location = "/";
    return;
  }

  this.nikname = account.name;
  this.messangerService.initialize(account, function (err) {
    if (err) {
      console.log("Error connect", err);
      // window.location = "/";
    } else {
      self.model = "Connected done";
      self.updateGroupClients();
      setInterval(self.updateGroupClients.bind(self), 4000);
    }
  });
}

MessangerCtrl.prototype.updateGroupClients = function () {
  var self = this;

  this.messangerService.getGroupClients("Public",
  function (err, data) {
    self.timeout(function () {
      console.log("getGroupClients:", data);
      self.online = data;
    }, 0);
  });
}

MessangerCtrl.prototype.send = function () {
 /* if (this.messages && this.messages.length > 0) {
    var account = this.authService.getAccount();
    console.log('SEND', this.messages);
    this.messangerService.send(account.name, "Public", this.messages);
    this.messages = "";
  }*/
}

MessangerCtrl.prototype.animatedScrollDown = function (animationTime, waitTime) {
  this.timeout(function () {
    $('#msgBody').stop().animate({
      scrollTop: $("#msgBody")[0].scrollHeight
    }, animationTime);
  }, waitTime);
}

var configMessangerCtrl = {
  controller: MessangerCtrl,
  templateUrl: "html/MessangerTemplate.html"
};

angular.module("app").component("messanger", configMessangerCtrl);
