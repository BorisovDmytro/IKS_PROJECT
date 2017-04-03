'use strict'

import fs from 'fs';


var config = {};

config = JSON.parse(fs.readFileSync(__dirname + '/config.json', "utf8"));

console.log(config);

export default (key, def) => {
  return config[key] || def;
}