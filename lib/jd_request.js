/**
 * Created by leoliew on 2016/11/1.
 */




function JDRequest(jd_config){

  this.jd_config = jd_config;
}



JDRequest.prototype.buildUrl = function(method){
  console.log(this.jd_config);
  return method;
};


exports.JDRequest = JDRequest;
