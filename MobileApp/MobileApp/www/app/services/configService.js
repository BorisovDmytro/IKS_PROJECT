'use strict'

function ConfigService() {
  this.url = 'http://192.168.0.109:8080/';
}

angular.module('app').service('configService', ConfigService);