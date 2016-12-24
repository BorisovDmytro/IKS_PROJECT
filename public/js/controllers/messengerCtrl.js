angular.module("App").controller("messengerCtrl", ["$scope", "authService", "messengerService", "$timeout", 
function($scope, authService, messengerService, $timeout) {

  $scope.messages = [];

  $scope.init = function() {
    $scope.isVisible = false;
    messengerService.subscribeMessageLoading(function(data) {
      $scope.messages = data;
    });

    messengerService.subscribeMessageUpdate(function(data) {
      console.log("subscribeMessageUpdate", data);
      $timeout(function() {
        $scope.messages.push(data);
      }, 10);
    });

    messengerService.initialize();
    authService.setLoginCb(function() {
      $scope.isVisible = true;
      $scope.account = authService.getAccount();
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