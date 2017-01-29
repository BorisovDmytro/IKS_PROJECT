var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

module.exports = {
  context: __dirname + "/src",
  entry: './index.js',
  output: {
    path: __dirname + '/build',
    filename: 'app.js'
  },
  plugins: [
    new CopyWebpackPlugin([
      {from: 'html',    to: 'html'},
      {from: 'lib',     to: 'lib'},
      {from: 'images',  to: 'images'},
      {from: 'css',     to: 'css'},
    ])
  ],

  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'},
      {
        test: /\.css$/, loader: 'style!css!'
      },
      { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" }
    ]
  }
};

