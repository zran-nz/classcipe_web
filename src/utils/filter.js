import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
import storage from 'store'
import { GRADE_COMMON } from '@/store/mutation-types'
import { PlanFieldDisplayName, TaskFieldDisplayName } from '@/const/common'
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

Vue.filter('dayjs1', function (dataStr, pattern = 'LLL') {
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
    if (currentDate.getTime() - date.toDate().getTime() < 5 * 1000) {
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
