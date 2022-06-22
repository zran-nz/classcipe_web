import moment from 'moment'
import { fileTypeMap } from '@/const/material'
import { SESSION_ACTIVE_KEY } from '@/const/common'
import { ACCESS_TOKEN, NOT_REMEMBER_ME } from '@/store/mutation-types'
import storage from 'store'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}
export function scorePassword (pass) {
  let score = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters = {}
  for (let i = 0; i < pass.length; i++) {
      letters[pass[i]] = (letters[pass[i]] || 0) + 1
      score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
      digits: /\d/.test(pass),
      lower: /[a-z]/.test(pass),
      upper: /[A-Z]/.test(pass),
      nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
      variationCount += (variations[check] === true) ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return parseInt(score)
}

export function renderSize (value) {
  if (value === null || value === '') {
    return '0 Bytes'
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let index = 0
  const srcSize = parseFloat(value)
  index = Math.floor(Math.log(srcSize) / Math.log(1024))
  let size = srcSize / Math.pow(1024, index)
  size = size.toFixed(2)// 保留的小数位数
  return size + unitArr[index]
}

export function formatLocalUTC (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment.utc(dataStr).local().format(pattern)
}

export function getFileType (fileTypeStr) {
  if (fileTypeStr.indexOf('image') !== -1) {
    return fileTypeMap.img
  } else if (fileTypeStr.indexOf('video') !== -1) {
    return fileTypeMap.video
  } else if (fileTypeStr.indexOf('audio') !== -1) {
    return fileTypeMap.audio
  } else {
    return fileTypeMap.other
  }
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj (obj) {
  if (!(typeof obj === 'object')) {
    return
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key) &&
      (obj[key] == null || obj[key] === undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

// // 对比两个对象的值是否完全相等 返回值 true/false
// export function isObjectValueEqual (a, b) {
//   // 取对象a和b的属性名
//   var aProps = Object.getOwnPropertyNames(a)
//   var bProps = Object.getOwnPropertyNames(b)
//   // 判断属性名的length是否一致
//   console.log(aProps.length + '--------' + bProps.length)
//   if (aProps.length !== bProps.length) {
//     return false
//   }
//   // 循环取出属性名，再判断属性值是否一致
//   for (var i = 0; i < aProps.length; i++) {
//     var propName = aProps[i]
//     console.log(propName)
//     if (typeof a[propName] === 'string') {
//       if (a[propName] !== b[propName]) {
//         console.log('not equal :' + a[propName] + '--------' + b[propName])
//         return false
//       }
//     } else if (typeof a[propName] === 'string') {
//
//     }
//   }
//   return true
// }

export function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]

    var propA = a[propName]
    var propB = b[propName]
    if (!b.hasOwnProperty(propName)) return false
    if ((propA instanceof Object)) {
      if (isObjectValueEqual(propA, propB)) {
        // return true     这里不能return ,后面的对象还没判断
      } else {
        return false
      }
    } else if (propA !== propB) {
      return false
    } else { }
  }
  return true
}

export function randomString(e) {
  e = e || 32
  const t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const a = t.length
  let n = ''
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}

export function setCookie(name, value) {
  var Days = 7
  var exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';domain=.classcipe.com;path=/'
}

export function getCookie(name) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  const arr = document.cookie.match(reg)
  if (arr) {
    return decodeURI(arr[2])
  } else {
    return null
  }
}

export function delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() }
}

export function getToken() {
  let token = storage.get(ACCESS_TOKEN)
  if (storage.get(NOT_REMEMBER_ME)) {
     token = window.sessionStorage.getItem(SESSION_ACTIVE_KEY)
  }
  return token
}

/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 获取日期区间的所有日期
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} format
 */
export function getDaysBetweenDates(startDate, endDate, format = 'YYYY-MM-DD') {
  const daysList = []
  const SDate = moment(startDate)
  const EDate = moment(endDate)
  daysList.push(SDate.format(format))
  if (SDate.isSame(EDate, 'day')) {
    return daysList
  }
  while (SDate.add(1, 'days').isBefore(EDate, 'day')) { // 注意这里add方法处理后SDate对象已经改变。
      daysList.push(SDate.format(format))
  }
  daysList.push(EDate.format(format))
  return daysList
}

export function getUrlWithNoParams(url) {
  if (url.indexOf('?') === -1 || url.indexOf('token=') === -1) { return url } else {
    return url.split('?')[0]
  }
}

/*
 * @param x {Object} 对象1
 * @param y {Object} 对象2
 * @return  {Boolean} true 为相等，false 为不等
 */
export function deepEqual(x, y) {
  // 指向同一内存时
  if (x === y) {
    return true
  } else if ((typeof x === 'object' && x != null) && (typeof y === 'object' && y != null)) {
    if (Object.keys(x).length !== Object.keys(y).length) {
      return false
    }
    for (var prop in x) {
      if (y.hasOwnProperty(prop)) {
        if (!deepEqual(x[prop], y[prop])) return false
      } else {
        return false
      }
    }
    return true
  } else {
    return false
  }
}
