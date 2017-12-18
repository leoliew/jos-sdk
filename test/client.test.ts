/**
 * Created by leoliew on 2016/11/1.
 */

import * as should from 'should'
import { JDClient } from '../src'
import { jdConfig } from './jdConfig'

describe('JDClient:handleAPI Test', () => {
  const client = new JDClient(jdConfig.appKey, jdConfig.appSecret, jdConfig.accessToken)
  it('Should getProductInfo success!', async () => {
    const params = ['1090817274', '11024717589']
    const results = await client.getProductInfo(params)
    should.equal(results[0].skuId,1090817274)
    should.equal(results[1].skuId,11024717589)
  })
  it('Should batchGetCode success!', async () => {
    const params = {
      ids: ['1090817274', '11024717589']
    }
    const results = await client.batchGetCode(params)
    should.equal(results[0].id,1090817274)
    should.equal(results[1].id,11024717589)
  })
})
