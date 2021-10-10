import request from '@/utils/request'

export const tagAPIUrl = {
  GetUserTags: '/classcipe/api/tag/getUserTags',
  UserTagAddOrUpdate: '/classcipe/api/tag/addOrUpdateUserTag',
  AddUserTagNew: '/classcipe/api/tag/addUserTagNew',
  AddUserParentTag: '/classcipe/api/tag/addUserParentTag',
  UserTagDelete: '/classcipe/api/tag/userTagDelete',
  UserTagDeleteNew: '/classcipe/api/tag/userTagDeleteNew',
  GetTreeByKey: '/classcipe/api/tag/getTreeByKey',
  GetGlobalTree: '/classcipe/api/tag/getTree',
  GetRootGlobalTag: '/classcipe/api/tag/getRootGlobalTag',
  GetGlobalTagKeywords: '/classcipe/api/tag/getTagKeywords',
  TagQueryById: '/classcipe/api/tag/queryById',
  TagDelete: '/classcipe/api/tag/delete',
  TagDeleteBatch: '/classcipe/api/tag/deleteBatch',
  FindCustomTags: '/classcipe/api/tag/findCustomTags',
  GetTagYearTips: '/classcipe/api/tag/getTagYearTips'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetRootGlobalTag (parameter) {
  return request({
    url: tagAPIUrl.GetRootGlobalTag,
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

export function GetTagYearTips (parameter) {
  return request({
    url: tagAPIUrl.GetTagYearTips,
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
export function AddUserTagNew (parameter) {
  return request({
    url: tagAPIUrl.AddUserTagNew,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function AddUserParentTag (parameter) {
  return request({
    url: tagAPIUrl.AddUserParentTag,
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

export function UserTagDeleteNew (parameter) {
  return request({
    url: tagAPIUrl.UserTagDeleteNew,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function FindCustomTags (parameter) {
  return request({
    url: tagAPIUrl.FindCustomTags,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
