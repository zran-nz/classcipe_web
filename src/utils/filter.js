import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import storage from 'store'
import { GRADE_COMMON } from '@/store/mutation-types'
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

Vue.filter('dayjs1', function (dataStr, pattern = 'lll') {
  if (dataStr) {
    return moment.utc(dataStr).local().format(pattern)
  }
  return ''
})

Vue.filter('dayComment', function (dataStr, pattern = 'LLL') {
  if (dataStr) {
    const date = moment.utc(dataStr).local()
    const currentDate = new Date()
    // 五分钟以内
    if (currentDate.getTime() - date.toDate().getTime() < 5 * 60 * 1000) {
        return 'Just now'
    } else if (currentDate.getTime() - date.toDate().getTime() < 24 * 60 * 60 * 100) {
        return 'Today ' + date.format('LT')
    } else {
      return date.format(pattern)
    }
  }
  return ''
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr) {
    return moment.utc(dataStr).local().format(pattern)
  }
  return ''
})

Vue.filter('gradeFormat', function (commonGradeList) {
  const gradeJson = storage.get(GRADE_COMMON)
  if (!gradeJson) {
    if (commonGradeList) {
      return commonGradeList.join(',')
    }
  } else {
    if (commonGradeList) {
      const result = []
      commonGradeList.forEach(grade => {
        if (gradeJson[grade]) {
          gradeJson[grade].forEach(i => {
            if (result.indexOf(i) === -1) {
              result.push(i)
            }
          })
        }
      })
      return result.join(',')
    }
  }
  return ''
})

/**
 * 10000 => 10,000.00
 * @param {number} s
 * @param {digit} n
 */
 Vue.filter('percentFormat', function(s, n) {
  if (typeof s === 'undefined' || s === null) s = 0
  n = n >= 0 && n <= 20 ? n : 2
  // eslint-disable-next-line no-useless-escape
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
  const l = s
      .split('.')[0]
      .split('')
      .reverse()
    const r = n > 0 ? '.' + s.split('.')[1] : ''
  let t = ''
    let i
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
  }
  return (
    t
      .split('')
      .reverse()
      .join('') + r
  )
})
