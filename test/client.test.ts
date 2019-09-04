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

  test('获取推广商品信息接口', async () => {
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

  test('获取通用推广链接', async () => {
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
      materialId: 'https://item.jd.com/1090817274.html',
      siteId: '505422491'
    }
    const results = await client.commonGet(params)
    expect(results).toHaveProperty('clickURL')
  })


  test('订单查询接口', async () => {
    const mock = JSON.stringify(
      {
        jd_union_open_order_query_response:
          {
            result:
              '{"code":200,"hasMore":false,"message":"success","requestId":"21922_0b12a2f1_k05bqk5b_7811527"}',
            code: '0'
          }
      }
    )
    nock('https://api.jd.com/routerjson')
      .post(/open\.order\.query/)
      .reply(200, mock)
    const params = {
      pageNo: 1,
      pageSize: 1,
      type: 1,
      time: '201811031212'
    }
    const results = await client.orderQuery(params)
    expect(results).toBe(undefined)
  })

  test('京粉精选商品查询接口', async () => {
    const mock = JSON.stringify(
      {
        jd_union_open_goods_jingfen_query_response:
          {
            result:
              '{"code":200,"data":[{"brandCode":"2317","brandName":"SCARPA","categoryInfo":{"cid1":1318,"cid1Name":"运动户外","cid2":2628,"cid2Name":"户外鞋服","cid3":12136,"cid3Name":"徒步鞋"},"comments":317,"commissionInfo":{"commission":82.14,"commissionShare":6.0},"couponInfo":{"couponList":[]},"goodCommentsShare":97.0,"imageInfo":{"imageList":[{"url":"http://img14.360buyimg.com/ads/jfs/t1/65214/10/9129/230919/5d6dd565Ec63ecb4f/33083348a198a76a.jpg"},{"url":"http://img14.360buyimg.com/ads/jfs/t15835/128/2093614858/182057/92eb66ba/5a8e9b85N4cb6f122.jpg"},{"url":"http://img14.360buyimg.com/ads/jfs/t4747/349/1054703261/96445/c678ead2/58ec7e40N0bdd1b50.jpg"},{"url":"http://img14.360buyimg.com/ads/jfs/t4519/107/2187351388/114854/4dafae39/58ec7e40N6620f8b5.jpg"},{"url":"http://img14.360buyimg.com/ads/jfs/t4846/349/1062601873/303088/2b9ef80e/58ec7e41N24b31b55.jpg"}]},"inOrderCount30Days":16,"inOrderCount30DaysSku":1,"isHot":1,"materialUrl":"item.jd.com/11868562572.html","owner":"p","pinGouInfo":{},"priceInfo":{"price":1369.0},"resourceInfo":{"eliteId":11,"eliteName":"品牌好货-潮流范儿"},"shopInfo":{"shopId":662751,"shopName":"SCARPA旗舰店"},"skuId":11868562572,"skuName":"SCARPA 户外鞋男鞋 zen禅轻量版 GTX防水 春夏抓地登山鞋 缓震低帮徒步鞋 黑拼橙 42","spuid":11868562569}],"message":"success","requestId":"21922_0b12a2ef_k05c80ge_7889760","totalCount":121}',
            code: '0'
          }
      }
    )
    nock('https://api.jd.com/routerjson')
      .post(/goods\.jingfen\.query/)
      .reply(200, mock)
    const results = await client.goodsJingfenQuery({
      eliteId: 11,
      pageIndex: 1,
      pageSize: 1,
      sortName: 'price',
      sort: 'desc'
    })
    expect(results[0].brandCode).toBeDefined()
    expect(results[0].brandName).toBeDefined()
    expect(results[0].categoryInfo).toBeDefined()
    expect(results[0].comments).toBeDefined()
    expect(results[0].priceInfo).toBeDefined()
  })


  test('商品类目查询', async () => {
    const mock = JSON.stringify(
      {
        jd_union_open_category_goods_get_response:
          {
            result:
              '{"code":200,"data":[{"grade":0,"name":"数码","id":652,"parentId":0},{"grade":0,"name":"电脑、办公","id":670,"parentId":0},{"grade":0,"name":"家用电器","id":737,"parentId":0},{"grade":0,"name":"食品饮料","id":1320,"parentId":0},{"grade":0,"name":"服饰内衣","id":1315,"parentId":0},{"grade":0,"name":"美妆护肤","id":1316,"parentId":0},{"grade":0,"name":"运动户外","id":1318,"parentId":0},{"grade":0,"name":"母婴","id":1319,"parentId":0},{"grade":0,"name":"家居日用","id":1620,"parentId":0},{"grade":0,"name":"图书","id":1713,"parentId":0},{"grade":0,"name":"礼品","id":1672,"parentId":0},{"grade":0,"name":"文娱","id":4053,"parentId":0},{"grade":0,"name":"本地生活/旅游出行","id":4938,"parentId":0},{"grade":0,"name":"钟表","id":5025,"parentId":0},{"grade":0,"name":"数字内容","id":5272,"parentId":0},{"grade":0,"name":"厨具","id":6196,"parentId":0},{"grade":0,"name":"珠宝首饰","id":6144,"parentId":0},{"grade":0,"name":"玩具乐器","id":6233,"parentId":0},{"grade":0,"name":"宠物生活","id":6994,"parentId":0},{"grade":0,"name":"汽车用品","id":6728,"parentId":0},{"grade":0,"name":"医药保健","id":9192,"parentId":0},{"grade":0,"name":"家装建材","id":9855,"parentId":0},{"grade":0,"name":"家具","id":9847,"parentId":0},{"grade":0,"name":"手机通讯","id":9987,"parentId":0},{"grade":0,"name":"鞋靴","id":11729,"parentId":0},{"grade":0,"name":"生鲜","id":12218,"parentId":0},{"grade":0,"name":"酒类","id":12259,"parentId":0},{"grade":0,"name":"团购","id":12367,"parentId":0},{"grade":0,"name":"整车","id":12379,"parentId":0},{"grade":0,"name":"农资园艺","id":12473,"parentId":0},{"grade":0,"name":"处方药","id":13314,"parentId":0},{"grade":0,"name":"教育培训","id":13678,"parentId":0},{"grade":0,"name":"二手商品","id":13765,"parentId":0},{"grade":0,"name":"邮币","id":13887,"parentId":0},{"grade":0,"name":"IP","id":13996,"parentId":0},{"grade":0,"name":"工业品","id":14065,"parentId":0},{"grade":0,"name":"房地产","id":15083,"parentId":0},{"grade":0,"name":"艺术品","id":15126,"parentId":0},{"grade":0,"name":"家纺","id":15248,"parentId":0},{"grade":0,"name":"家庭清洁/纸品","id":15901,"parentId":0},{"grade":0,"name":"京东服务","id":15980,"parentId":0},{"grade":0,"name":"个人护理","id":16750,"parentId":0},{"grade":0,"name":"箱包皮具","id":17329,"parentId":0},{"grade":0,"name":"非遗","id":18528,"parentId":0}],"message":"success","requestId":"21922_0ab504e5_k05d3spq_8081056"}',
            code: '0'
          }
      }
    )
    nock('https://api.jd.com/routerjson')
      .post(/category\.goods\.get/)
      .reply(200, mock)
    const results = await client.categoryGoodsGet({
      parentId: 0,
      grade: 0
    })
    expect(results[0].grade).toBeDefined()
    expect(results[0].name).toBeDefined()
    expect(results[0].id).toBeDefined()
    expect(results[0].parentId).toBeDefined()
  })


  test('获取PID', async () => {
    const mock = JSON.stringify(
      {
        jd_union_open_user_pid_get_response:
          {
            result:
              '{"code":200,"data":"1000610323_0_1389801615","message":"success","requestId":"21922_0aaf3d42_k05ecbzd_8254609"}',
            code: '0'
          }
      }
    )
    nock('https://api.jd.com/routerjson')
      .post(/user\.pid\.get/)
      .reply(200, mock)
    const results = await client.pidGet({
      unionId: 1000008444,
      childUnionId: 1000610323,
      promotionType: 2
    })
    expect(results).toBe('1000610323_0_1389801615')
  })
})
