import request from '@/utils/request'

export const scenarioAPIUrl = {
  GetAllSdgs: '/classcipe/api/scenario/getAllSdgs',
  ScenarioSearch: '/classcipe/api/scenario/search',
  ScenarioSearchKey: '/classcipe/api/scenario/searchKey',
  ScenarioAddOrUpdate: '/classcipe/api/scenario/addOrUpdate',
  ScenarioQueryById: '/classcipe/api/scenario/queryById',
  ScenarioDelete: '/classcipe/api/scenario/delete',
  ScenarioDeleteBatch: '/classcipe/api/scenario/deleteBatch',
  ScenarioList: '/classcipe/api/scenario/list',
  ScenarioGetKeywordScenarios: '/classcipe/api/scenario/getKeywordScenarios',
  ScenarioQueryContentByScenarioId: '/classcipe/api/scenario/queryContentByScenarioId',
  QueryBigIdea: '/classcipe/api/scenario/queryBigIdea',
  QueryContentByBigIdea: '/classcipe/api/scenario/queryContentByBigIdea'
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

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ScenarioGetKeywordScenarios (parameter) {
  return request({
    url: scenarioAPIUrl.ScenarioGetKeywordScenarios,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter keywordsId或descriptionId
 * @returns {AxiosPromise}
 * @constructor
 */
export function ScenarioQueryContentByScenarioId (parameter) {
  return request({
    url: scenarioAPIUrl.ScenarioQueryContentByScenarioId,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryBigIdea (parameter) {
  return request({
    url: scenarioAPIUrl.QueryBigIdea,
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
export function QueryContentByBigIdea (parameter) {
  return request({
    url: scenarioAPIUrl.QueryContentByBigIdea,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
