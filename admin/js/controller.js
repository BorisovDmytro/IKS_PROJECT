app.controller("adminCtrl", AdminCtrl);

function AdminCtrl($scope, $http) {
  $scope.signUpModel = {
    email: "",
    name: "",
    pass: ""
  };

  $scope.onAddClick = function () {
    console.log("On click ");
    $('#addDlg').modal("show");
  }

  $scope.onAddAccount = function () {
    signUpRequest($scope.signUpModel);
    refreshAccounts(); 
  }

  $scope.init = function() {
    refreshAccounts(); 
  }

  function refreshAccounts() {
    getAccounts(function(err, accounts) {
      $scope.accounts = accounts;
    });
  }

  function signUpRequest(model) {
    $http({
      method: 'PUT',
      url: '/auth',
      data: model
    }).then(function (answ) {
      model = {
        email: "",
        name: "",
        pass: ""
      };
      alert("Add account success");
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
