import * as crypto from 'crypto'
import * as querystring from 'querystring'
import * as request from 'superagent'
import * as _ from 'lodash'
import { Utils } from './utils'

const defaultConfig = {
  format: 'json',
  v: '1.0',
  apiUrl: 'https://router.jd.com/api'
}

const jdAPI = {
  goodsInfo: {
    method: 'jd.union.open.goods.promotiongoodsinfo.query',
    version: '1.0'
  },
  commentGet: {
    method: 'jd.union.open.promotion.common.get',
    version: '1.0'
  },
  orderQuery: {
    method: 'jd.union.open.order.query',
    version: '1.0'
  },
  orderBonusQuery: {
    method: 'jd.union.open.order.bonus.query',
    version: '1.0'
  },
  goodsQuery: {
    method: 'jd.union.open.goods.query',
    version: '1.0'
  },
  goodsJingfenQuery: {
    method: 'jd.union.open.goods.jingfen.query',
    version: '1.0'
  },
  goodsBigFieldQuery: {
    method: 'jd.union.open.goods.bigfield.query',
    version: '1.0'
  },
  goodsLinkQuery: {
    method: 'jd.union.open.goods.link.query',
    version: '1.0'
  },
  couponQuery: {
    method: 'jd.union.open.coupon.query',
    version: '1.0'
  },
  categoryGoodsGet: {
    method: 'jd.union.open.category.goods.get',
    version: '1.0'
  },
  goodsStudentPriceQuery: {
    method: 'jd.union.open.goods.stuprice.query',
    version: '1.0'
  },
  goodsSecKillQuery: {
    method: 'jd.union.open.goods.seckill.query',
    version: '1.0'
  },
  goodsPromotionGoodsInfoQuery: {
    method: 'jd.union.open.goods.promotiongoodsinfo.query',
    version: '1.0'
  },
  positionCreate: {
    method: 'jd.union.open.position.create',
    version: '1.0'
  },
  appletGet: {
    method: 'jd.union.open.promotion.applet.get',
    version: '1.0'
  },
  subUnionIdGet: {
    method: 'jd.union.open.promotion.subunionid.get',
    version: '1.0'
  },
  byUnionIdGet: {
    method: 'jd.union.open.promotion.byunionid.get',
    version: '1.0'
  },
  pidGet: {
    method: 'jd.union.open.user.pid.get',
    version: '1.1'
  },
  positionQuery: {
    method: 'jd.union.open.position.query',
    version: '1.0'
  },
  couponImportation: {
    method: 'jd.union.open.coupon.importation',
    version: '1.0'
  }
}

/**
 * jd client object Constructor method
 * @param config
 * @returns {JDClient}
 * @constructor
 */
export class JDClient {

  public appKey: string
  public appSecret: string
  public apiUrl: string
  public accessToken?: string
  public format: string
  public v: string

  constructor (appKey: string, appSecret: string, accessToken?: string, format: string = defaultConfig.format, v: string = defaultConfig.v, apiUrl: string = defaultConfig.apiUrl) {
    this.appKey = appKey
    this.appSecret = appSecret
    this.apiUrl = apiUrl
    this.accessToken = accessToken
    this.format = format
    this.v = v
  }

  /**
   * 根据sku获取产品数据
   * @param skuIds
   */
  public async getProductInfo (skuIds: string[]) {
    const ids = {
      skuIds: skuIds.join(',')
    }
    return await this.handleAPI(jdAPI.goodsInfo, ids) || []
  }

  /**
   * 获取通用推广链接
   * @param params
   */
  public async commonGet (params: { materialId: string, siteId?: string, positionId?: string, subUnionId?: string, ext1?: string, pid?: string, couponUrl?: string }) {
    const requestParams = {
      promotionCodeReq: params
    }
    return await this.handleAPI(jdAPI.commentGet, requestParams)
  }

  /**
   * 订单查询接口
   * @param params
   */
  public async orderQuery (params: { pageNo: number, pageSize: number, type: number, time: string }) {
    const requestParams = {
      orderReq: params
    }
    return await this.handleAPI(jdAPI.orderQuery, requestParams)
  }

  /**
   * 京粉精选查询接口
   * @param params
   */
  public async goodsJingfenQuery (params: { eliteId: number, pageIndex: number, pageSize: number, sortName: string, sort: string }) {
    const requestParams = {
      goodsReq: params
    }
    return await this.handleAPI(jdAPI.goodsJingfenQuery, requestParams)
  }


  /**
   * 商品类目查询
   * @param params
   */
  public async categoryGoodsGet (params: { parentId: number, grade: number }) {
    const requestParams = {
      req: params
    }
    return await this.handleAPI(jdAPI.categoryGoodsGet, requestParams)
  }

  /**
   * 获取PID
   * @param params
   */
  public async pidGet (params: { unionId: number, childUnionId: number, promotionType: number, positionName?: string, mediaName?: string }) {
    const requestParams = {
      pidReq: params
    }
    return await this.handleAPI(jdAPI.pidGet, requestParams)
  }


  /**
   * return the parameter of signature
   * @param jdApi
   * @param appParam
   */
  private signUrl (jdApi: { method: string, version: string }, appParam: object) {
    let params = []
    let sysParam: {
      app_key: string,
      format: string,
      method: string
      sign_method: string,
      v: string,
      timestamp: string,
      param_json: string,
      access_token?: string
    } = {
      app_key: this.appKey,
      format: this.format,
      method: jdApi.method,
      sign_method: 'md5',
      v: jdApi.version || this.v,
      timestamp: Utils.formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      param_json: JSON.stringify(appParam)
    }
    if (this.accessToken) {
      sysParam.access_token = this.accessToken
    }
    let sign = this.appSecret
    _.keys(sysParam).forEach((key) => {
      let param = key + sysParam[key]
      params.push(param)
    })
    params.sort()
    for (let i = 0; i < params.length; i++) {
      sign += params[i]
    }
    sign += this.appSecret
    sign = crypto.createHash('md5').update(sign, 'utf8').digest('hex').toUpperCase()
    sysParam = Object.assign(sysParam, {
      sign: sign
    })
    return this.apiUrl + '?' + querystring.stringify(sysParam)
  }

  /**
   * Invoke an api by method name.
   * @param jdApi
   * @param appParam
   * @returns {Promise<any>}
   */
  private async handleAPI (jdApi: { method: string, version: string }, appParam?: object) {
    const responseParser = jdApi.method.replace(/\./g, '_') + '_response'
    const url = this.signUrl(jdApi, appParam)
    let returnResult
    try {
      const response = await request.post(url).set('Content-Type', 'application/json')
      const parsedJson = JSON.parse(response.text)
      if (parsedJson.error_response) {
        console.error(parsedJson.error_response)
      }
      returnResult = JSON.parse(parsedJson[responseParser]['result'])['data']
    } catch (e) {
      console.error(e)
      throw new Error(`解析京东api数据出现错误，详情请查看log！${e}`)
    }
    return returnResult
  }
}
