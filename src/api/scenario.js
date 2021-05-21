import request from '@/utils/request'

export const topicAPIUrl = {
  ScenarioAddOrUpdate: '/classcipe/api/topic/addOrUpdate',
  ScenarioQueryById: '/classcipe/api/topic/queryById',
  ScenarioDelete: '/classcipe/api/topic/delete',
  ScenarioDeleteBatch: '/classcipe/api/topic/deleteBatch',
  ScenarioList: '/classcipe/api/topic/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ScenarioAddOrUpdate (parameter) {
  return request({
    url: topicAPIUrl.ScenarioAddOrUpdate,
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
export function ScenarioQueryById (parameter) {
  return request({
    url: topicAPIUrl.ScenarioQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ScenarioDelete (parameter) {
  return request({
    url: topicAPIUrl.ScenarioDelete,
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
export function ScenarioDeleteBatch (parameter) {
  return request({
    url: topicAPIUrl.ScenarioDeleteBatch,
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
export function ScenarioList (parameter) {
  return request({
    url: topicAPIUrl.ScenarioList,
    method: 'get',
    params: parameter
  })
}
