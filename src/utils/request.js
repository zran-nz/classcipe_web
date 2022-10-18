import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import * as logger from '@/utils/logger'
import router from '../router'
import qs from 'qs'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000, // 请求超时时间
  headers: {
    'Cache-Control': 'no-cache'
  }
})

// 异常拦截处理器
const errorHandler = (error) => {
  const { config, request, response } = error
  ErrCall({ type: 'classcipe_web.request', method: config.method, headers: config.headers,
    href: request.responseURL, body: config.data, msg: response.data?.message || 'request error', status: response.status, stack: JSON.stringify(response.data) })
  if (response) {
    const data = response.data
    // 从 localstorage 获取 token
    if (response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在,且请求未主动设置token,则设置 token
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token && !config.headers['X-Access-Token']) {
    config.headers['X-Access-Token'] = token
  } else {
    logger.info(ACCESS_TOKEN + ' no set')
  }
  // 支持传递数组
  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  return config
}, errorHandler)

export const ErrorCode = {
  token_expires: 510,
  ppt_google_token_expires: 520,
  zoom_token_expires: 530,
  ppt_forbidden: 403,
  auth_limit: 401
}

// response interceptor
request.interceptors.response.use((response) => {
  if (response && response.data && response.data.code && response.data.code !== 0) {
    // if code is 510 token invalid
    if (response.data.code === ErrorCode.token_expires) {
      const token = storage.get(ACCESS_TOKEN)
      if (token) {
        store.dispatch('ClearAuth').then(() => {
          setTimeout(() => {
            // window.location.reload()
            router.push({ name: 'login' })
          }, 1500)
        })
      }
    } else if (response.data.code === ErrorCode.ppt_google_token_expires || response.data.code === ErrorCode.ppt_forbidden) {
      const googleAuthUrl = response.data.result.googleAuthUrl
      var windowObjectReference
      var height = 600
      var width = 800
      // 获得窗口的垂直位置
      var iTop = (window.screen.availHeight - 30 - height) / 2
      // 获得窗口的水平位置
      var iLeft = (window.screen.availWidth - 10 - width) / 2
      var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=' + iTop + ',left=' + iLeft
      windowObjectReference = window.open('about:blank', '_blank', strWindowFeatures)
      if (windowObjectReference) {
        windowObjectReference.location = googleAuthUrl
      } else {
        // 弹出框被拦截
        alert('The authorization window is blocked by the browser, please allow the authorization window to pop up and then refresh the page.')
      }
    } else if (response.data.code === ErrorCode.auth_limit) {
      notification.warning({
        message: 'Reminder',
        description: response.data.message,
        icon: h => {
          return h('a-icon', {
            props: {
              type: 'alert'
            }
          })
        }
      })
      logger.error(response.data)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        notification.warning({
          message: 'Reminder',
          description: response.data.message,
          icon: h => {
            return h('a-icon', {
              props: {
                type: 'alert'
              }
            })
          }
        })
      }
      logger.error(response.data)
    }
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
