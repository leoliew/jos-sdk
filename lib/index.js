/**
 *
 * @param method
 * @param appParam
 * @param callback
 */


var JDRequest = require('./jd_request').JDRequest;


function JDClient(config){

  this.jd_config = config;

}


JDClient.prototype.handleAPI = function(method,appParam,callback){
  
  var jd_request = new JDRequest(this.jd_config);

  callback(null,null);

};



exports.JDClient = JDClient;
