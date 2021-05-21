import request from '@/utils/request'

export const topicAPIUrl = {
  TopicAddOrUpdate: '/classcipe/api/topic/addOrUpdate',
  TopicQueryById: '/classcipe/api/topic/queryById',
  TopicDelete: '/classcipe/api/topic/delete',
  TopicDeleteBatch: '/classcipe/api/topic/deleteBatch',
  TopicList: '/classcipe/api/topic/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TopicAddOrUpdate (parameter) {
  return request({
    url: topicAPIUrl.TopicAddOrUpdate,
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
export function TopicQueryById (parameter) {
  return request({
    url: topicAPIUrl.TopicQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TopicDelete (parameter) {
  return request({
    url: topicAPIUrl.TopicDelete,
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
export function TopicDeleteBatch (parameter) {
  return request({
    url: topicAPIUrl.TopicDeleteBatch,
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
export function TopicList (parameter) {
  return request({
    url: topicAPIUrl.TopicList,
    method: 'get',
    params: parameter
  })
}
