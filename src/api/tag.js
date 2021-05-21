import request from '@/utils/request'

export const tagAPIUrl = {
  TagAddOrUpdate: '/classcipe/api/tag/addOrUpdate',
  TagQueryById: '/classcipe/api/tag/queryById',
  TagDelete: '/classcipe/api/tag/delete',
  TagDeleteBatch: '/classcipe/api/tag/deleteBatch',
  TagList: '/classcipe/api/tag/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TagAddOrUpdate (parameter) {
  return request({
    url: tagAPIUrl.TagAddOrUpdate,
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
export function TagQueryById (parameter) {
  return request({
    url: tagAPIUrl.TagQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TagDelete (parameter) {
  return request({
    url: tagAPIUrl.TagDelete,
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
export function TagDeleteBatch (parameter) {
  return request({
    url: tagAPIUrl.TagDeleteBatch,
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
export function TagList (parameter) {
  return request({
    url: tagAPIUrl.TagList,
    method: 'get',
    params: parameter
  })
}
