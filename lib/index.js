const crypto = require('crypto');
const querystring = require('querystring');
const request = require('superagent');
const utils = require('./utils');

/**
 * jd client object Constructor method
 * @param config
 * @returns {JDClient}
 * @constructor
 */
function JDClient (config) {
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
  this.api_url = config.api_url || 'http://gw.api.360buy.com/routerjson';
  this.app_secret = config['app_secret'];
  this.sysParam = {};
  if (config['access_token']) {
    this.sysParam['access_token'] = config['access_token'];
  }
  this.sysParam['app_key'] = config['app_key'];
  this.sysParam['format'] = config['format'];
  this.sysParam['v'] = config['v'];
}

/**
 * return the parameter of signature
 * @param {String} method, method name
 * @param {Object} appParam, method parameter
 */
JDClient.prototype.sign = function (method, appParam) {
  let params = [];
  let sign = this.app_secret;
  this.sysParam['method'] = method;
  this.sysParam['timestamp'] = utils.nowTime();
  this.sysParam['360buy_param_json'] = JSON.stringify(appParam);
  for (let key in this.sysParam) {
    if (!key || !this.sysParam[key]) {
      continue;
    }
    let param = key + this.sysParam[key];
    params.push(param);
  }
  params.sort();
  for (let i = 0; i < params.length; i++) {
    sign += params[i];
  }
  sign += this.app_secret;
  sign = crypto.createHash('md5').update(sign, 'utf8').digest('hex').toUpperCase();
  return sign;
};

/**
 * transform object to the query string
 * @param {String} method, method name
 * @param {Object} appParam, method parameter
 */
JDClient.prototype.buildUrl = function (method, appParam) {
  this.sysParam['sign'] = this.sign(method, appParam);
  return this.api_url + '?' + querystring.stringify(this.sysParam);
};

/**
 * Invoke an api by method name.
 * @param method
 * @param appParam
 * @param callback
 */
JDClient.prototype.handleAPI = function (method, appParam, callback) {
  const url = this.buildUrl(method, appParam);
  request.post(url)
    .set('Content-Type', 'application/json')
    .end(function (err, res) {
      callback(err, res.text);
    });
};

exports.JDClient = JDClient;
