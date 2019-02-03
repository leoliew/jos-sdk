/**
 * Created by leoliew on 2016/11/1.
 */

import * as should from 'should'
import { JDClient } from '../src'
import { jdConfig } from './jdConfig'
import * as nock from 'nock'

describe('JDClient:handleAPI Test', () => {
  const client = new JDClient(jdConfig.appKey, jdConfig.appSecret, jdConfig.accessToken)
  afterEach(function () {
    nock.cleanAll()
  })

  it('Should getProductInfo success!', async () => {
    const mock = JSON.stringify({
      'jingdong_service_promotion_goodsInfo_responce': {
        'code': '0',
        'getpromotioninfo_result': '{\"message\":\"接口成功\",\"result\":[{\"cid\":737,\"cid2\":17394,\"cid2Name\":\"家电配件\",\"cid3\":17398,\"cid3Name\":\"生活电器配件\",\"cidName\":\"家用电器\",\"commisionRatioPc\":8.0,\"commisionRatioWl\":8.0,\"endDate\":32472115200000,\"goodsName\":\"绿尘 适配米家小米小瓦石头扫地机器人配件水洗尘盒滤网主刷边刷套餐S1\",\"imgUrl\":\"http://img14.360buyimg.com/n1/jfs/t1/3702/23/2128/341814/5b95cba9Eb4ea1c83/95861374883cf1d1.jpg\",\"inOrderCount\":441,\"isFreeFreightRisk\":0,\"isFreeShipping\":2,\"isJdSale\":1,\"isSeckill\":0,\"materialUrl\":\"http://item.jd.com/8249616.html\",\"shopId\":1000017104,\"skuId\":8249616,\"startDate\":1543852800000,\"unitPrice\":139.00,\"vid\":1000017104,\"wlUnitPrice\":139.00},{\"cid\":9192,\"cid2\":9194,\"cid2Name\":\"营养成分\",\"cid3\":9215,\"cid3Name\":\"蛋白质\",\"cidName\":\"医药保健\",\"commisionRatioPc\":2.5,\"commisionRatioWl\":2.5,\"endDate\":32472115200000,\"goodsName\":\"禾博士 多维矿物质大豆蛋白粉 乳清蛋白原料进口 双蛋白桶装400g\",\"imgUrl\":\"http://img14.360buyimg.com/n1/jfs/t12451/182/1287483320/104774/45621e5d/5a1e2f75N81974477.jpg\",\"inOrderCount\":2,\"isFreeFreightRisk\":1,\"isFreeShipping\":1,\"isJdSale\":0,\"isSeckill\":0,\"materialUrl\":\"http://item.jd.com/1090817274.html\",\"shopId\":59935,\"skuId\":1090817274,\"startDate\":1500652800000,\"unitPrice\":88.00,\"vid\":59935,\"wlUnitPrice\":88.00}],\"sucessed\":true}'
      }
    })
    nock('https://api.jd.com/routerjson')
      .post(/goodsInfo/)
      .reply(200, mock)
    const params = ['1090817274', '8249616']
    const results = await client.getProductInfo(params)
    // console.info(results)
    should.exist(results[0].skuId)
    should.exist(results[1].skuId)
  })
  it('Should batchGetCode success!', async () => {
    const mock = JSON.stringify({
      'jingdong_service_promotion_batch_getcode_responce': {
        'code': '0',
        'querybatch_result': '{\"resultCode\":\"0\",\"resultMessage\":\"获取代码成功\",\"urlList\":[{\"id\":1090817274,\"url\":\"http://union-click.jd.com/jdc?e=&p=AyIHZRJTEQcTB1wYXyUCEw9UElsTARQCZV8ETVxNNwxeHlQJDBkNXg9JHU4YDk5ER1xOGRRYBUBGQEJLG1odAxsHUxhdEB1LQglGa2BAT0FTARpAZ3J1D2AZT1JuTyUZDmUOHmlWGlscAhEHUhhZJQYTA1AYWBAKEjdVGloUAxoFVh1bJTISBmVaNREKGgVRK1olAhYCUBNdEQsbAFYeWyUFIgdUE1kUABsGUxI1STIiN2UraxUyETcKXwZIMhM%3D&t=W1dCFBBFC1pXUwkEBwpZRxgHRQcLQ1FZAF8JUBwSBl0aUhUEEQFQBAJQXk8%3D\"},{\"id\":11024717589,\"url\":\"http://union-click.jd.com/jdc?e=&p=AyIHZR5bHAEWA10bXyUCEgZWHl0VBBYOXSsfSlpMWGVCHlBDGRlLQx5BXg1bSkAOClBMW0taGEtXVlUQBVsVAxECUxtdEQsaGAxeB0gyVVMOaR4cHGBnLmUOEFBBelF9U0NSYgtZdVgUAhsHVhtcFgAiA1QfXhYBFw9VK1sUAxMGXRlYEwIiN1Uaa1RsFg9XGF0cMhM3VR9eEAoUA1wSXBYGEjdSK1sUChAGVxJaEwt8W2UrayUyIgdlGGtKRk9aZRo%3D&t=W1dCFBBFC1pXUwkEBwpZRxgHRQcLQ1FZAF8JUBwSB1QYXhMCFANcE0RMR05a\"}]}'
      }
    })
    const params = {
      ids: ['1090817274', '11024717589']
    }
    const results = await client.batchGetCode(params)
    console.info(results)
    should.equal(results[0].id, 1090817274)
    should.equal(results[1].id, 11024717589)
  })
})
