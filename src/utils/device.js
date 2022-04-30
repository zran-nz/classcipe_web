import enquireJs from 'enquire.js'
import { DEVICE } from '@/const/common'

const enquireScreen = function (callback) {
  const matchDesktop = {
    match: () => {
      callback && callback(DEVICE.DESKTOP)
    }
  }

  const matchTablet = {
    match: () => {
      callback && callback(DEVICE.TABLET)
    }
  }

  const matchMobile = {
    match: () => {
      callback && callback(DEVICE.MOBILE)
    }
  }
  enquireJs.register('screen and (max-width: 576px)', matchMobile)
  enquireJs.register('screen and (min-width: 576px) and (max-width: 1199px)', matchTablet)
  enquireJs.register('screen and (min-width: 1200px)', matchDesktop)
}

export default enquireScreen
