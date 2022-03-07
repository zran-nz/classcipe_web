import request from '@/utils/request'

export const formConfigAPIUrl = {
  addOrUpdate: '/classcipe/api/formConfig/addOrUpdate',
  data: '/classcipe/api/formConfig/data',
  user: '/classcipe/api/formConfig/user'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FormConfigAddOrUpdate (parameter) {
  return request({
    url: formConfigAPIUrl.addOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FormConfigData (parameter) {
  return request({
    url: formConfigAPIUrl.data,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FormConfigUser (parameter) {
  return request({
    url: formConfigAPIUrl.user,
    method: 'get',
    params: parameter
  })
}
