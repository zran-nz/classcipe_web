import Vue from 'vue'
import moment from 'moment'
import storage from 'store'
import { GRADE_COMMON } from '@/store/mutation-types'
import { getLabelNameType } from '@/const/teacher'
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

/**
 * 计算距离指定日期之间的时间
 */
Vue.filter('distanceDate', function(date, diffDate = new Date()) {
  if (date) {
    let totalSeconds = moment(date).diff(moment(diffDate), 'seconds')
    if (totalSeconds < 0) {
      return date
    }
    let days = 0
    let hours = 0
    let minutes = 0
    if (totalSeconds > 60) {
      minutes = parseInt(totalSeconds / 60)
      totalSeconds = parseInt(totalSeconds % 60)
      if (minutes > 60) {
        hours = parseInt(minutes / 60)
        minutes = parseInt(minutes % 60)
        if (hours > 24) {
          days = parseInt(hours / 24)
          hours = parseInt(hours % 24)
        }
      }
    }
    let result = ''
    if (totalSeconds > 0) {
      result = parseInt(totalSeconds) + '秒'
    }
    if (minutes > 0) {
      result = parseInt(minutes) + '分' + result
    }
    if (hours > 0) {
      result = parseInt(hours) + '小时' + result
    }
    if (days > 0) {
      result = parseInt(days) + '天' + result
    }
    return result
  }
  return ' - '
})

Vue.filter('sizeFormat', function (size) {
  if (size) {
    if (size >= 1073741824) {
      return (size / 1073741824).toFixed(2) + 'GB'
    }

    if (size >= 1048576) {
      return (size / 1048576).toFixed(2) + 'MB'
    }

    if (size >= 1024) {
      return (size / 1024).toFixed(2) + 'KB'
    }

    return size + 'B'
  }

  return '0MB'
})

Vue.filter('type2Name', function (type) {
  return getLabelNameType(type)
})

Vue.filter('upCaseFirst', function (text) {
  return text?.trim().length ? text[0].toUpperCase() + text.slice(1) : ''
})
