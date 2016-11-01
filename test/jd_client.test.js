/**
 * Created by leoliew on 2016/11/1.
 */
var should = require('should');
var JDClient = require('../lib/index').JDClient;
var jd_config = require('./jd_config');

describe('JDClient:handleAPI Test', function () {
  var params = {"skuIds": "1090817274,10902817274"};
  var client = new JDClient(jd_config);
  it('Should be tested', function (done) {
    client.handleAPI("jingdong.service.promotion.goodsInfo", params, function (err, results) {
      var data = JSON.parse(results);
      var ndata = data.jingdong_service_promotion_goodsInfo_responce.getpromotioninfo_result;
      JSON.parse(ndata).result.should.be.an.instanceOf(Array);
      done(err);
    });
  });
});
