var app = angular.module("App", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    template: "<auth></auth>"
    //templateUrl : "html/auth.html"
  })
  .when("/main", {
    template: "<messanger></messanger>"
    //templateUrl : "html/main.html"
  });
});