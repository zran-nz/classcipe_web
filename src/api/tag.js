import request from '@/utils/request'

export const tagAPIUrl = {
  GetTreeByKey: '/classcipe/api/tag/getTreeByKey',
  GetTree: '/classcipe/api/tag/getTree',
  TagAddOrUpdate: '/classcipe/api/tag/addOrUpdate',
  TagQueryById: '/classcipe/api/tag/queryById',
  TagDelete: '/classcipe/api/tag/delete',
  TagDeleteBatch: '/classcipe/api/tag/deleteBatch',
  TagTree: '/classcipe/api/tag/getTree'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetTreeByKey (parameter) {
  return request({
    url: tagAPIUrl.GetTreeByKey,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetTree (parameter) {
  return request({
    url: tagAPIUrl.GetTree,
    method: 'get',
    params: parameter
  })
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
export function TagTree (parameter) {
  return request({
    url: tagAPIUrl.TagTree,
    method: 'get',
    params: parameter
  })
}
