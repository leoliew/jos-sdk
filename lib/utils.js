/**
 * Created by leoliew on 2016/11/1.
 */

module.exports = {
  /**
   * format Date '2016-10-10 11:23:50'
   * @returns {string}
   */
  nowTime: function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = this.zeroPad(date.getMonth() + 1, 2);
    const day = this.zeroPad(date.getDate(), 2);
    const hour = this.zeroPad(date.getHours(), 2);
    const minutes = this.zeroPad(date.getMinutes(), 2);
    const seconds = this.zeroPad(date.getSeconds(), 2);
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
  },

  /**
   *
   * @param number
   * @param length
   * @returns {*|string}
   */
  zeroPad: function (number, length) {
    number = number.toString();
    while (number.length < length) {
      number = '0' + number;
    }
    return number;
  }

};
