angular.module("App").controller("authCtrl", ["$scope", "authService", 
function($scope, authService) {
  $scope.isLogin = true;

  $scope.onSubmite = function() {
    if($scope.isLogin) {
      // TODO LOGIN REQUEST
     console.log(authService); 
     console.log($scope.loginEmail, $scope.loginPassword);
    } else {
      // TODO SIGN UP REQUEST
    }
  }

}]);