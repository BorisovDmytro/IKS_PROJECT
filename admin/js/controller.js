app.controller("adminCtrl", AdminCtrl);

function AdminCtrl($scope, $http, $timeout) {
  $scope.signUpModel = {
    email: "",
    name: "",
    pass: ""
  };

  $scope.onAddClick = function () {
    $('#addDlg').modal("show");
  }

  $scope.onAddAccount = function () {
    signUpRequest($scope.signUpModel);
  }

  $scope.init = function() {
    refreshAccounts(); 
  }

  function refreshAccounts() {
    getAccounts(function(err, accounts) {
      $timeout(function () {
        $scope.accounts = accounts;
      }, 10);
    });
  }

  function signUpRequest(model) {
    $http({
      method: 'PUT',
      url: '/auth',
      data: model
    }).then(function (answ) {
      $scope.signUpModel = {
        email: "",
        name: "",
        pass: ""
      };
      refreshAccounts(); 
    }, function (err) {
      // err
      alert("Add account error");
    });
  }

  function getAccounts(cb) {
    $http({
      method: 'GET',
      url: '/accounts'
    }).then(function (answ) {
      cb(null, answ.data);
    }, function (err) {
      cb(err);
    });
  }
}
