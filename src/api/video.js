import request from '@/utils/request'

export const videoAPIUrl = {
  VideoAddOrUpdate: '/classcipe/api/v2/video/addOrUpdate',
  VideoQueryById: '/classcipe/api/v2/video/queryById',
  VideoDelete: '/classcipe/api/v2/video/delete',
  VideoDeleteBatch: '/classcipe/api/v2/video/deleteBatch',
  VideoList: '/classcipe/api/v2/video/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function VideoAddOrUpdate (parameter) {
  return request({
    url: videoAPIUrl.VideoAddOrUpdate,
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
export function VideoQueryById (parameter) {
  return request({
    url: videoAPIUrl.VideoQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function VideoDelete (parameter) {
  return request({
    url: videoAPIUrl.VideoDelete,
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
export function VideoDeleteBatch (parameter) {
  return request({
    url: videoAPIUrl.VideoDeleteBatch,
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
export function VideoList (parameter) {
  return request({
    url: videoAPIUrl.VideoList,
    method: 'get',
    params: parameter
  })
}
