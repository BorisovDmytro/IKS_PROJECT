angular.module("App").controller("messengerCtrl", ["$scope", "messengerService", 
function($scope, messengerService) {

  $scope.init = function() {
    messengerService.initialize();
  }

  $scope.send = function() {

  }

}]);