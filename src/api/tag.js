import request from '@/utils/request'

export const tagAPIUrl = {
  GetUserTags: '/classcipe/api/tag/getUserTags',
  UserTagAddOrUpdate: '/classcipe/api/tag/addOrUpdateUserTag',
  UserTagDelete: '/classcipe/api/tag/userTagDelete',
  GetTreeByKey: '/classcipe/api/tag/getTreeByKey',
  GetGlobalTree: '/classcipe/api/tag/getTree',
  GetGlobalTagKeywords: '/classcipe/api/tag/getTagKeywords',
  TagQueryById: '/classcipe/api/tag/queryById',
  TagDelete: '/classcipe/api/tag/delete',
  TagDeleteBatch: '/classcipe/api/tag/deleteBatch'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetGlobalTree (parameter) {
  return request({
    url: tagAPIUrl.GetGlobalTree,
    method: 'get',
    params: parameter
  })
}

export function GetTreeByKey (parameter) {
  return request({
    url: tagAPIUrl.GetTreeByKey,
    method: 'get',
    params: parameter
  })
}

export function GetGlobalTagKeywords (parameter) {
  return request({
    url: tagAPIUrl.GetGlobalTagKeywords,
    method: 'get',
    params: parameter
  })
}

export function GetUserTags (parameter) {
  return request({
    url: tagAPIUrl.GetUserTags,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function UserTagAddOrUpdate (parameter) {
  return request({
    url: tagAPIUrl.UserTagAddOrUpdate,
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
export function UserTagDelete (parameter) {
  return request({
    url: tagAPIUrl.UserTagDelete,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
