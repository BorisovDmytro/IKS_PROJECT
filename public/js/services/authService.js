angular.module("App").factory('authService', 
['$http', 
function(http) {
  return {
    login: function(email, pass, cb) {
      http({
         method: 'POST',
         url: '/auth',
         data: {email: email, pass: pass}
      }).then(function(answ) {
        cb(null, answ.data); // {id: dadsda, name: "name"}
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
    }
  };
}]);