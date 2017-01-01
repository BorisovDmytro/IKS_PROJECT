var app = angular.module("App", ["ngRoute"]);

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "html/auth.html"
  })
  .when("/main", {
    templateUrl : "html/main.html"
  });
});