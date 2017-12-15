const crypto = require('crypto');
const querystring = require('querystring');
const request = require('superagent');
const utils = require('./utils');

const defaultConfig = {
  webId : '505422491',
  unionId: '1000093271',
  channel: 'WL'
}

const jdParser = {
  goodsInfo: {
    apiParser: 'jingdong.service.promotion.goodsInfo',
    responseParser: 'jingdong_service_promotion_goodsInfo_responce',
    resultParser: 'getpromotioninfo_result',
    returnParser: 'result'
  },
  batchGetCode: {
    apiParser: 'jingdong.service.promotion.batch.getcode',
    responseParser: 'jingdong_service_promotion_batch_getcode_responce',
    resultParser: 'querybatch_result',
    returnParser: 'urlList'
  }
};

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
 * @param parser
 * @param appParam
 * @returns {Promise<any>}
 */
JDClient.prototype.handleAPI = async function (parser, appParam) {
  const url = this.buildUrl(parser.apiParser, appParam);
  return new Promise((resolve, reject) => {
    request.post(url)
      .set('Content-Type', 'application/json')
      .end(function (err, res) {
        if (err) {
          reject(err);
        } else {
          try {
            const parsedJson = JSON.parse(res.text);
            const returnResult = (JSON.parse(parsedJson[parser.responseParser][parser.resultParser])[parser.returnParser]);
            resolve(returnResult);
          } catch (e) {
            reject(e);
          }
        }
      });
  });
};

JDClient.prototype.getProductInfo = async function (skuIds) {
  const ids = {skuIds: skuIds.join(',')};
  return await this.handleAPI(jdParser.goodsInfo, ids) || [];
};

JDClient.prototype.batchGetCode = async function (params) {
  params.webId = params.webId ? params.webId : defaultConfig.webId
  params.unionId = params.unionId ? params.unionId : defaultConfig.unionId
  params.channel = params.channel ? params.channel : defaultConfig.channel
  params.url = utils.formatJdUrl(params.ids, params.channel)
  params.id = params.ids.join(',')
  return await this.handleAPI(jdParser.batchGetCode, params)
}

exports.JDClient = JDClient;
