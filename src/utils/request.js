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
  timeout: 30000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    if (error.response.status === 403) {
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

// response interceptor
request.interceptors.response.use((response) => {
  if (response && response.data && response.data.code && response.data.code !== 0) {
    // if code is 510 token invalid
    if (response.data.code === 510) {
      const token = storage.get(ACCESS_TOKEN)
      if (token) {
        store.dispatch('ClearAuth').then(() => {
          setTimeout(() => {
            // window.location.reload()
            router.push({ name: 'login' })
          }, 1500)
        })
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        notification.error({
          message: 'error',
          description: response.data.message
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
