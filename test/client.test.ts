/**
 * Created by leoliew on 2016/11/1.
 */
import { JDClient } from '../src'
import { jdConfig } from './jdConfig'
import * as nock from 'nock'

describe('JDClient:handleAPI Test', () => {
  const client = new JDClient(jdConfig.appKey, jdConfig.appSecret)
  afterEach(() => {
    nock.cleanAll()
  })

  test('Should getProductInfo success!', async () => {
    const mock = JSON.stringify({
      jd_union_open_goods_promotiongoodsinfo_query_response:
        {
          result:
            '{"code":200,"data":[{"unitPrice":139.00,"materialUrl":"http://item.jd.com/8249616.html","endDate":32472115200000,"isFreeFreightRisk":0,"isFreeShipping":2,"commisionRatioWl":5.0,"commisionRatioPc":5.0,"imgUrl":"http://img14.360buyimg.com/n1/jfs/t1/62318/38/8408/298144/5d66475dE18fb59f4/d490cc14374ad603.jpg","vid":1000017104,"cidName":"家用电器","wlUnitPrice":139.00,"cid2Name":"家电配件","isSeckill":0,"cid2":17394,"cid3Name":"生活电器配件","inOrderCount":273,"cid3":17398,"shopId":1000017104,"isJdSale":1,"goodsName":"绿尘 适配米家小米小瓦石头扫地机器人配件尘盒滤网主刷边刷套餐S1","skuId":8249616,"startDate":1565712000000,"cid":737},{"unitPrice":172.00,"materialUrl":"http://item.jd.com/1090817274.html","endDate":32472115200000,"isFreeFreightRisk":0,"isFreeShipping":1,"commisionRatioWl":2.5,"commisionRatioPc":2.5,"imgUrl":"http://img14.360buyimg.com/n1/jfs/t13330/300/1277147754/133075/d297668f/5a1e2f76Nae3c487f.jpg","vid":59935,"cidName":"医药保健","wlUnitPrice":172.00,"cid2Name":"营养成分","isSeckill":0,"cid2":9194,"cid3Name":"蛋白质","inOrderCount":0,"cid3":9215,"shopId":59935,"isJdSale":0,"goodsName":"禾博士 多维矿物质大豆蛋白粉 清蛋白原料进口 双蛋白桶装400g","skuId":1090817274,"startDate":1500652800000,"cid":9192}],"message":"接口成功","requestId":"21922_0aaf1e59_k0178z25_7768594"}',
          code: '0'
        }
    })
    nock('https://api.jd.com/routerjson')
      .post(/goodsInfo/)
      .reply(200, mock)
    const params = ['1090817274', '8249616']
    const results = await client.getProductInfo(params)
    expect(results[0]).toHaveProperty('skuId')
    expect(results[1]).toHaveProperty('skuId')
  })
  test('Should commonGet success!', async () => {
    const mock = JSON.stringify({
      jd_union_open_promotion_common_get_response:
        {
          result:
            '{"code":200,"data":{"clickURL":"https://union-click.jd.com/jdc?e=&p=AyIGZRJTEQcTB1wYXyUCEw9UElsTARQCZV8ETVxNNwxeHlRAGRlLQx5BXg1cAAQJS14MB1QTWhwCFARTHkRMR05aZU4kEAtIbygBOFAFRWw%2BeRxxYRZcS3tXGTIWBlEeWBYHGgdlG1oUAxMPVxhdFTIiB1QrGnsGGg9XH2sUMhIDUh1ZEQsTA1QTXBYyEg9RK1sUChAGVxJaEwt8W2UraxYyIjdVK1slXVZaCCtZFAMQBQ%3D%3D"},"message":"success","requestId":"21922_0aaf2ee8_k018ik5b_8107043"}',
          code: '0'
        }
    })
    nock('https://api.jd.com/routerjson')
      .post(/common/)
      .reply(200, mock)
    const params = {
      promotionCodeReq: {
        materialId: 'https://item.jd.com/1090817274.html',
        siteId: '505422491'
      }
    }
    const results = await client.commonGet(params)
    expect(results).toHaveProperty('clickURL')
  })
})
