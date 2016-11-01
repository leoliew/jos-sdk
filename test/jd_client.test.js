/**
 * Created by leoliew on 2016/11/1.
 */
var should = require('should');
var JDClient = require('../lib/index').JDClient;

describe('JDClient:buildUrl', function(){
  var config = {
    access_token: '',
    app_secret: '',
    app_key: '',
    format: 'json',
    v: '2.0'
  }
  var params = {"skuIds":"1090817274,10902817274"};
  var client = new JDClient(config);
  it('Should be tested', function(done){
    client.handleAPI("jingdong.service.promotion.goodsInfo", params, function (err, results) {
      var data = JSON.parse(results);
      var ndata = data.jingdong_service_promotion_goodsInfo_responce.getpromotioninfo_result;
      console.log(JSON.parse(ndata).result);
      JSON.parse(ndata).result.should.be.an.instanceOf(Array);
      done(err);
    });
  });
});
