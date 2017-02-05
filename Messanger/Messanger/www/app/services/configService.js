'use strict'

function ConfigService() {
  //this.url = 'http://46.149.86.255:10000/';
  console.log('Create  config service')
  this.url = '192.168.0.102';
  this.port = 10000;
  this.absUrl = 'http://' + this.url + ':' + this.port;
}

angular.module('app').service('configService', ConfigService);