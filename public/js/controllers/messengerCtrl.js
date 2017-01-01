angular.module("App").controller("messengerCtrl", ["$scope", "authService", "messengerService", "$timeout", 
function($scope, authService, messengerService, $timeout) {

  $scope.messages = [];

  $scope.init = function() {
    $scope.isVisible = false;
    messengerService.subscribeMessageLoading(function(data) {  
      $timeout(function () {
        $scope.messages = data;

        var doc = document.getElementById("msgBody");
        doc.scrollTop = doc.scrollHeight;

        $('#msgBody').stop().animate({
          scrollTop: $("#msgBody")[0].scrollHeight
        }, 600);  
      }, 10);
    });

    messengerService.subscribeMessageUpdate(function(data) {
      console.log("subscribeMessageUpdate", data);
      $timeout(function() {
        $scope.messages.push(data);
        
         $('#msgBody').stop().animate({
          scrollTop: $("#msgBody")[0].scrollHeight
        }, 200);  
      }, 10);
    });

    
    authService.setLoginCb(function() {
      $scope.isVisible = true;
      $scope.account = authService.getAccount();
      messengerService.initialize($scope.account);
    });
  }

  $scope.send = function() {
    if($scope.sendMessage) {      
      var account = authService.getAccount();
      messengerService.send(account.name, "Public", $scope.sendMessage);
      $scope.sendMessage = "";
    }
  }

}]);