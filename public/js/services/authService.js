angular.module("App").factory('authService', 
['$http', 
function(http) {

  var account = null;
  var loginCb = function() {};

  return {
    login: function(email, pass, cb) {
      http({
         method: 'POST',
         url: '/auth',
         data: {email: email, pass: pass}
      }).then(function(answ) {
        account = answ.data;
        loginCb();
        cb(null);
        // ok
      }, function(err) {
        // err
        cb(err);
      });
    },

    signUp: function(email, name, pass, cb) {
        http({
         method: 'PUT',
         url: '/auth',
         data: {email: email, pass: pass, name: name}
      }).then(function(answ) {
        // ok
         cb(null, answ.data); // success
      }, function(err) {
        // err
        cb(err);
      });
    },

    getAccount: function() {
      return account;
    },

    setLoginCb: function(cb) {
      loginCb = cb;
    }
  };
}]);