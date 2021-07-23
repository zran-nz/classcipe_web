import request from '@/utils/request'

export const evaluationAPIUrl = {
  addOrUpdate: '/classcipe/api/evaluation/addOrUpdate',
  delete: '/classcipe/api/evaluation/delete',
  deleteBatch: '/classcipe/api/evaluation/deleteBatch',
  list: '/classcipe/api/evaluation/list',
  queryById: '/classcipe/api/evaluation/queryById'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function EvaluationAddOrUpdate (parameter) {
  return request({
    url: evaluationAPIUrl.addOrUpdate,
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
export function EvaluationQueryById (parameter) {
  return request({
    url: evaluationAPIUrl.queryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function EvaluationDelete (parameter) {
  return request({
    url: evaluationAPIUrl.delete + '?id=' + parameter.id,
    method: 'post',
    data: parameter
  })
}
