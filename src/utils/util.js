import moment from 'moment'
import { fileTypeMap } from '@/const/material'

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

// 对比两个对象的值是否完全相等 返回值 true/false
export function isObjectValueEqual (a, b) {
  // 取对象a和b的属性名
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  // 判断属性名的length是否一致
  console.log(aProps.length + '--------' + bProps.length)
  // if (aProps.length !== bProps.length) {
  //   return false
  // }
  // 循环取出属性名，再判断属性值是否一致
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    console.log(a[propName] + '--------' + b[propName])
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}
