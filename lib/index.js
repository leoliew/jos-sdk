/**
 *
 * @param method
 * @param appParam
 * @param callback
 */


var JDRequest = require('./jd_request').JDRequest;


function JDClient(api_url,app_key,app_secret,access_token,format,v){

  this.api_url = api_url;
  this.app_key = app_key;
  this.app_secret = app_secret;
  this.access_token = access_token;
  this.format = format;
  this.v = v;

}


JDClient.prototype.handleAPI = function(method,appParam,callback){

  var jd_request = new JDRequest(this.jd_config);

  callback(null,null);

};



exports.JDClient = JDClient;
