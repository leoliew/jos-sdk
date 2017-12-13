/**
 * Created by leoliew on 2016/11/1.
 */
const should = require('should');
const JDClient = require('../lib/index').JDClient;
const jd_config = require('./jd_config');

describe('JDClient:handleAPI Test', function () {
  const params = {"skuIds": "1090817274,10902817274"};
  const client = new JDClient(jd_config);
  it('Should be tested', function (done) {
    client.handleAPI("jingdong.service.promotion.goodsInfo", params, function (err, results) {
      const data = JSON.parse(results);
      const ndata = data.jingdong_service_promotion_goodsInfo_responce.getpromotioninfo_result;
      JSON.parse(ndata).result.should.be.an.instanceOf(Array);
      done(err);
    });
  });
});
