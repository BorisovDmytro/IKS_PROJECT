angular.module("App").controller("authCtrl", ["$scope", "authService",
function($scope, authService) {
  $scope.isLogin = true;
  $scope.visible = true;

  $scope.onSubmite = function() {
    if($scope.isLogin) {
      // TODO LOGIN REQUEST
     console.log(authService); 
     console.log($scope.loginEmail, $scope.loginPassword);
     authService.login($scope.loginEmail, $scope.loginPassword, function(err) {
       if(err) {
         console.error(err);
       } else {
         console.log("Account", authService.getAccount());
         $scope.visible = false;
       } 
     });
    } else {
      // TODO SIGN UP REQUEST
      console.log($scope.signupLogin, $scope.signupUserName,  $scope.signupPassword);
      authService.signUp($scope.signupLogin, $scope.signupUserName,  $scope.signupPassword, function(err) {
        if(err) 
          console.error(err);
      });
    }
  }

}]);