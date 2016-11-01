var crypto = require('crypto');
var querystring = require("querystring");
var request = require('superagent');

function JDClient(config) {

  if (!(this instanceof JDClient)) {
    return new JDClient(config);
  }

  config = config || {};
  if (!config.app_key || !config.app_secret) {
    throw new Error('appkey or appsecret need!');
  }

  if (!config.app_secret) {
    throw new Error('Bad parameters, need app_secret');
  }
  this.api_url = config.api_url || "http://gw.api.360buy.com/routerjson";
  this.app_secret = config["app_secret"];

  this.sysParam = {};

  if (config["access_token"]) {
    this.sysParam["access_token"] = config["access_token"];
  }
  this.sysParam["app_key"] = config["app_key"];
  this.sysParam["format"] = config["format"];
  this.sysParam["v"] = config["v"];
}

function zeroPad(number, length) {
  number = number.toString();
  while (number.length < length) {
    number = '0' + number;
  }
  return number;
}
/**
 * return the parameter of signature
 *
 * @param {String} method, method name
 * @param {Object} appParam, method parameter
 */
JDClient.prototype.sign = function (method, appParam) {
  var params = [];
  var sign = this.app_secret;

  this.sysParam["method"] = method;
  this.sysParam["timestamp"] = this.nowTime();
  this.sysParam["360buy_param_json"] = JSON.stringify(appParam);

  for (var key in this.sysParam) {
    if (!key || !this.sysParam[key]) {
      continue;
    }
    var param = key + this.sysParam[key];
    params.push(param);
  }
  params.sort();
  for (var i = 0; i < params.length; i++) {
    sign += params[i];
  }
  sign += this.app_secret;
  // console.log(sign);
  //md5
  sign = crypto.createHash('md5').update(sign, 'utf8').digest("hex").toUpperCase();
  // console.log(sign);
  return sign;
};
/**
 * format Date '2016-10-10 11:23:50'
 */
JDClient.prototype.nowTime = function () {
  var date = new Date();
  var year = date.getFullYear();
  var month = zeroPad(date.getMonth() + 1, 2);
  var day = zeroPad(date.getDate(), 2);
  var hour = zeroPad(date.getHours(), 2);
  var minutes = zeroPad(date.getMinutes(), 2);
  var seconds = zeroPad(date.getSeconds(), 2);
  var now = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
  return now;
};
/**
 * transform object to the query string
 *
 * @param {String} method, method name
 * @param {Object} appParam, method parameter
 */
JDClient.prototype.buildUrl = function (method, appParam) {
  var sign = this.sign(method, appParam);
  this.sysParam["sign"] = sign;
  var url = this.api_url + "?" + querystring.stringify(this.sysParam);
  return url;
};

/**
 * Invoke an api by method name.
 *
 * @param {String} method, method name
 * @param {Object} appParam
 * @param {Function(err, response)} callback
 */
JDClient.prototype.handleAPI = function (method, appParam, callback) {
  var url = this.buildUrl(method, appParam);
  request.post(url)
    .set("Content-Type", "application/json")
    .end(function (err, res) {
      callback(err, res.text);
    });
};

exports.JDClient = JDClient;
