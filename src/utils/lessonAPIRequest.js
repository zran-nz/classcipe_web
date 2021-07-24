import axios from 'axios'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import * as logger from '@/utils/logger'

// 创建课堂api axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_LESSON_API_BASE_URL,
  timeout: 6000 // 请求超时时间
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
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    if (!config.data) {
      config.data = { token }
    } else if (!config.data['token']) {
      config.data['token'] = token
    }
  } else {
    logger.info(ACCESS_TOKEN + ' no set')
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  if (response && response.data && response.data.code && response.data.code !== 'ok') {
    if (process.env.NODE_ENV !== 'production') {
      notification.error({
        message: 'lesson api error',
        description: response.data.message
      })
    }
    logger.error(response.data)
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
