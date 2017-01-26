
import services   from './app/services';
import components from './app/componets';

const app = angular.module("App", ["ngRoute"]);

services(app);
components(app);

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    template: "<auth></auth>"
  })
  .when("/main", {
    template: "<messanger></messanger>"
  });
});