angular.module("App").controller("messengerCtrl", ["$scope", "authService", "messengerService", 
function($scope, authService, messengerService) {

  $scope.init = function() {
    $scope.isVisible = false;
    messengerService.initialize();
    authService.setLoginCb(function() {
      $scope.isVisible = true;
    });
  }

  $scope.send = function() {

  }

}]);