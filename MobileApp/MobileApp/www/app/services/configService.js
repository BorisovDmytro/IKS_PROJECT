'use strict'

class ConfigService extends IController {
  constructor() {
    this.url = 'http://192.168.0.109:8080/';
  }
}

angular.module('app').service('configService', ConfigService);