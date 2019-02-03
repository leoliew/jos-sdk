/**
 * Created by leoliew on 2016/11/1.
 */

import * as Moment from 'moment-timezone'

export namespace Utils {
  /**
   * @deprecated
   * format Date '2016-10-10 11:23:50'
   * @returns {string}
   */
  export function nowTime () {
    const date = new Date()
    const year = date.getFullYear()
    const month = this.zeroPad(date.getMonth() + 1, 2)
    const day = this.zeroPad(date.getDate(), 2)
    const hour = this.zeroPad(date.getHours(), 2)
    const minutes = this.zeroPad(date.getMinutes(), 2)
    const seconds = this.zeroPad(date.getSeconds(), 2)
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
  }

  /**
   * @deprecated
   * zeroPad
   * @param num
   * @param length
   * @returns {any}
   */
  export function zeroPad (num, length) {
    num = num.toString()
    while (num.length < length) {
      num = '0' + num
    }
    return num
  }

  /**
   * Get current time's Moment object with timezone
   *
   * @param {any} time
   * @return {Object} the Moment object
   */
  export function getCurrentMoment (time?) {
    Moment.tz.setDefault('Asia/Shanghai')
    return new Moment(time)
  }

  /**
   * Get current time of type timestamp
   *
   * @param {any} time
   */
  export function getCurrentTimestamp (time?) {
    return this.getCurrentMoment(time).valueOf()
  }

  /**
   * 格式化时间
   * @param time
   * @param format
   */
  export function formatTime (time?, format?) {
    return this.getCurrentMoment(time).format(format || 'YYYY-MM-DD')
  }

  /**
   * format jd url
   * @param ids
   * @param type
   * @returns {string}
   */
  export function formatJdUrl (ids, type) {
    if (!type || !ids) {
      return ''
    }
    let urlArr = []
    let jdurl = {
      PC: 'http://item.jd.com/',
      WL: 'http://item.m.jd.com/product/'
    }
    for (const id of ids) {
      urlArr.push(jdurl[type] + id + '.html')
    }
    return urlArr.join(',')
  }

}
