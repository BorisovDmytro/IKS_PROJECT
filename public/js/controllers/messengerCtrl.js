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
        $timeout(function () {
          $('#msgBody').stop().animate({
            scrollTop: $("#msgBody")[0].scrollHeight
          }, 200);  
        }, 100);
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

    $scope.account = authService.getAccount();
    if(!$scope.account)
      window.location = "/";

    $scope.nikname = $scope.account.name;

    messengerService.initialize($scope.account, function(err) {
      if(!err) {
        $scope.isVisible = true;
      } else {
        window.location = "/";
        $scope.isVisible = false;
      }
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