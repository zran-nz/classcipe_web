import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale(navigator.language)

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr) {
    return moment.utc(dataStr).local().format(pattern)
  }
  return ''
})

Vue.filter('dayjs1', function (dataStr, pattern = 'dddd, mm h:mm a') {
  if (dataStr) {
    return moment.utc(dataStr).local().format(pattern)
  }
  return ''
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr) {
    return moment.utc(dataStr).local().format(pattern)
  }
  return ''
})
