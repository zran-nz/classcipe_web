import request from '@/utils/request'

export const pdContentAPIUrl = {
  PDContentAddOrUpdate: '/classcipe/api/pdContent/addOrUpdate',
  PDContentQueryById: '/classcipe/api/pdContent/queryById',
  PDContentDelete: '/classcipe/api/pdContent/delete',
  PDContentDeleteBatch: '/classcipe/api/pdContent/deleteBatch',
  PDContentList: '/classcipe/api/pdContent/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function PDContentAddOrUpdate (parameter) {
  return request({
    url: pdContentAPIUrl.PDContentAddOrUpdate,
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
export function PDContentQueryById (parameter) {
  return request({
    url: pdContentAPIUrl.PDContentQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function PDContentDelete (parameter) {
  return request({
    url: pdContentAPIUrl.PDContentDelete,
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
export function PDContentDeleteBatch (parameter) {
  return request({
    url: pdContentAPIUrl.PDContentDeleteBatch,
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
export function PDContentList (parameter) {
  return request({
    url: pdContentAPIUrl.PDContentList,
    method: 'get',
    params: parameter
  })
}
