import request from '@/utils/request'

export const scenarioAPIUrl = {
  GetAllSdgs: '/classcipe/api/scenario/getAllSdgs',
  ScenarioSearch: '/classcipe/api/scenario/search',
  ScenarioAddOrUpdate: '/classcipe/api/scenario/addOrUpdate',
  ScenarioQueryById: '/classcipe/api/scenario/queryById',
  ScenarioDelete: '/classcipe/api/scenario/delete',
  ScenarioDeleteBatch: '/classcipe/api/scenario/deleteBatch',
  ScenarioList: '/classcipe/api/scenario/list'
}

/**
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetAllSdgs () {
  return request({
    url: scenarioAPIUrl.GetAllSdgs,
    method: 'get'
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ScenarioSearch (parameter) {
  return request({
    url: scenarioAPIUrl.ScenarioSearch,
    method: 'get',
    params: parameter
  })
}
/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ScenarioAddOrUpdate (parameter) {
  return request({
    url: scenarioAPIUrl.ScenarioAddOrUpdate,
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
    url: scenarioAPIUrl.ScenarioQueryById,
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
    url: scenarioAPIUrl.ScenarioDelete,
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
    url: scenarioAPIUrl.ScenarioDeleteBatch,
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
    url: scenarioAPIUrl.ScenarioList,
    method: 'get',
    params: parameter
  })
}
