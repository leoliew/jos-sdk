import * as crypto from 'crypto'
import * as querystring from 'querystring'
import * as request from 'superagent'
import * as _ from 'lodash'
import {Utils} from './utils'

export {Utils} from './utils'

const defaultConfig = {
  webId: '505422491',
  unionId: '1000093271',
  channel: 'WL',
  format: 'json',
  v: '2.0',
  apiUrl: 'http://gw.api.360buy.com/routerjson'
}

const jdParser = {
  goodsInfo: {
    apiParser: 'jingdong.service.promotion.goodsInfo',
    responseParser: 'jingdong_service_promotion_goodsInfo_responce',
    resultParser: 'getpromotioninfo_result',
    returnParser: 'result'
  },
  batchGetCode: {
    apiParser: 'jingdong.service.promotion.batch.getcode',
    responseParser: 'jingdong_service_promotion_batch_getcode_responce',
    resultParser: 'querybatch_result',
    returnParser: 'urlList'
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
  public accessToken: string
  public format: string
  public v: string

  constructor (appKey: string, appSecret: string, accessToken: string, format: string = defaultConfig.format, v: string = defaultConfig.v, apiUrl: string = defaultConfig.apiUrl) {
    this.appKey = appKey
    this.appSecret = appSecret
    this.apiUrl = apiUrl
    this.accessToken = accessToken
    this.format = format
    this.v = v
  }

  public async getProductInfo (skuIds: string[]) {
    const ids = {skuIds: skuIds.join(',')}
    return await this.handleAPI(jdParser.goodsInfo, ids) || []
  }

  public async batchGetCode (params) {
    params.webId = params.webId ? params.webId : defaultConfig.webId
    params.unionId = params.unionId ? params.unionId : defaultConfig.unionId
    params.channel = params.channel ? params.channel : defaultConfig.channel
    params.url = Utils.formatJdUrl(params.ids, params.channel)
    params.id = params.ids.join(',')
    return await this.handleAPI(jdParser.batchGetCode, params)
  }

  /**
   * return the parameter of signature
   * @param {String} method, method name
   * @param {Object} appParam, method parameter
   */
  private signUrl (method: string, appParam: object) {
    let params = []
    let sysParam = {
      access_token: this.accessToken,
      app_key: this.appKey,
      format: this.format,
      v: this.v,
      method: method,
      timestamp: Utils.nowTime(),
      '360buy_param_json': JSON.stringify(appParam)
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
    sysParam = Object.assign(sysParam, {sign: sign})
    return this.apiUrl + '?' + querystring.stringify(sysParam)
  }

  /**
   * Invoke an api by method name.
   * @param parser
   * @param appParam
   * @returns {Promise<any>}
   */
  private async handleAPI (parser, appParam) {
    const url = this.signUrl(parser.apiParser, appParam)
    return new Promise((resolve, reject) => {
      request.post(url)
        .set('Content-Type', 'application/json')
        .end(function (err, res) {
          if (err) {
            reject(err)
          } else {
            try {
              const parsedJson = JSON.parse(res.text)
              const returnResult = (JSON.parse(parsedJson[parser.responseParser][parser.resultParser])[parser.returnParser])
              resolve(returnResult)
            } catch (e) {
              reject(e)
            }
          }
        })
    })
  }
}
