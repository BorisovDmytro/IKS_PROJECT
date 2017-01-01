angular.module("App").controller("authCtrl", ["$scope", "authService",
function($scope, authService) {
  $scope.isLogin = true;
  $scope.visible = true;

  $scope.onSubmite = function() {
    if($scope.isLogin) {
      // TODO LOGIN REQUEST

     authService.login($scope.loginEmail, $scope.loginPassword, function(err) {
       if(err) {
         console.error(err);
       } else {
         console.log("Account", authService.getAccount());
         window.location = "/#!/main";
       } 
     });
    } else {
      // TODO SIGN UP REQUEST
      authService.signUp($scope.signupLogin, $scope.signupUserName,  $scope.signupPassword, function(err) {
        if(err) 
          console.error(err);
      });
    }
  }

}]);