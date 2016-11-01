/**
 * Created by leoliew on 2016/11/1.
 */

module.exports = {


  /**
   * format Date '2016-10-10 11:23:50'
   * @returns {string}
   */
  nowTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = this.zeroPad(date.getMonth() + 1, 2);
    var day = this.zeroPad(date.getDate(), 2);
    var hour = this.zeroPad(date.getHours(), 2);
    var minutes = this.zeroPad(date.getMinutes(), 2);
    var seconds = this.zeroPad(date.getSeconds(), 2);
    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
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
