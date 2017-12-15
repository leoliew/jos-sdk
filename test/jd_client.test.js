/**
 * Created by leoliew on 2016/11/1.
 */
const should = require('should');
const JDClient = require('../lib/index').JDClient;
const jd_config = require('./jd_config');

describe('JDClient:handleAPI Test', () => {

  it('Should getProductInfo success!', async () => {
    const params = ['1090817274', '11024717589'];
    const client = new JDClient(jd_config);
    const results = await client.getProductInfo(params);
    results[0].skuId.should.be.equal(1090817274);
    results[1].skuId.should.be.equal(11024717589);
  });
  it('Should batchGetCode success!', async () => {
    const params = {
      ids: ['1090817274', '11024717589']
    }
    const client = new JDClient(jd_config);
    const results = await client.batchGetCode(params);
    results[0].id.should.be.equal(1090817274);
    results[1].id.should.be.equal(11024717589);
  });
});
