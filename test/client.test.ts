/**
 * Created by leoliew on 2016/11/1.
 */
const should = require('should')
const JDClient = require('../src/index').JDClient
const jdConfig = require('./jdConfig')

describe('JDClient:handleAPI Test', () => {
  const client = new JDClient(jdConfig.appKey, jdConfig.appSecret, jdConfig.accessToken)
  it('Should getProductInfo success!', async () => {
    const params = ['1090817274', '11024717589']
    const results = await client.getProductInfo(params)
    results[0].skuId.should.be.equal(1090817274)
    results[1].skuId.should.be.equal(11024717589)
  })
  it('Should batchGetCode success!', async () => {
    const params = {
      ids: ['1090817274', '11024717589']
    }
    const results = await client.batchGetCode(params)
    results[0].id.should.be.equal(1090817274)
    results[1].id.should.be.equal(11024717589)
  })
})
