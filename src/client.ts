import * as crypto from 'crypto'
import * as util from 'util'
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
  goodsInfo: 'jd.union.open.goods.promotiongoodsinfo.query',
  commentGet: 'jd.union.open.promotion.common.get'
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
  public async commonGet (params: { promotionCodeReq: { materialId: string, siteId?: string, positionId?: string, subUnionId?: string, ext1?: string, pid?: string, couponUrl?: string } }) {
    return await this.handleAPI(jdAPI.commentGet, params)
  }

  /**
   * return the parameter of signature
   * @param {String} method, method name
   * @param {Object} appParam, method parameter
   */
  private signUrl (method: string, appParam: object) {
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
      method: method,
      sign_method: 'md5',
      v: this.v,
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
  private async handleAPI (jdApi: string, appParam?: object) {
    const responseParser = jdApi.replace(/\./g, '_') + '_response'
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
      throw new Error('解析京东api数据出现错误，详情请查看log！')
    }
    return returnResult
  }
}
