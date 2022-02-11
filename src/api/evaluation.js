import request from '@/utils/request'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export const evaluationAPIUrl = {
  addOrUpdate: '/classcipe/api/evaluation/addOrUpdate',
  delete: '/classcipe/api/evaluation/delete',
  deleteBatch: '/classcipe/api/evaluation/deleteBatch',
  list: '/classcipe/api/evaluation/list',
  queryById: '/classcipe/api/evaluation/queryById',
  queryByIds: '/classcipe/api/evaluation/queryByIds',
  findMyClasses: '/classcipe/api/evaluation/findMyClasses',
  GetSessionEvaluationByClassId: '/classcipe/api/evaluation/getSessionEvaluationByClassId',
  querySessionEvaluation: '/classcipe/api/evaluation/querySessionEvaluation',
  saveSessionEvaluation: '/classcipe/api/evaluation/saveSessionEvaluation',
  querySessionEvidence: '/classcipe/api/evaluation/querySessionEvidence',
  saveSessionEvidence: '/classcipe/api/evaluation/saveSessionEvidence',
  getEvaluationFormSet: '/classcipe/api/evaluation/getEvaluationFormSet',
  saveEvaluationFormSet: '/classcipe/api/evaluation/saveEvaluationFormSet',
  getEvaluationMode: '/classcipe/api/evaluation/getEvaluationMode',
  saveEvaluationMode: '/classcipe/api/evaluation/saveEvaluationMode'
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
export function EvaluationQueryByIds (parameter) {
  return request({
    url: evaluationAPIUrl.queryByIds,
    method: 'post',
    data: parameter
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

export function FindMyClasses (parameter) {
  const token = storage.get(ACCESS_TOKEN)
  parameter['token'] = token
  return request({
    url: evaluationAPIUrl.findMyClasses,
    method: 'post',
    data: parameter
  })
}

export function GetSessionEvaluationByClassId (parameter) {
  return request({
    url: evaluationAPIUrl.GetSessionEvaluationByClassId,
    method: 'get',
    params: parameter
  })
}

export function SaveSessionEvaluation (parameter) {
  return request({
    url: evaluationAPIUrl.saveSessionEvaluation,
    method: 'post',
    data: parameter
  })
}

export function QuerySessionEvaluation (parameter) {
  return request({
    url: evaluationAPIUrl.querySessionEvaluation,
    method: 'post',
    data: parameter
  })
}

export function QuerySessionEvidence (parameter) {
  return request({
    url: evaluationAPIUrl.querySessionEvidence,
    method: 'post',
    data: parameter
  })
}

export function SaveSessionEvidence (parameter) {
  return request({
    url: evaluationAPIUrl.saveSessionEvidence,
    method: 'post',
    data: parameter
  })
}

export function GetEvaluationFormSet (parameter) {
  return request({
    url: evaluationAPIUrl.getEvaluationFormSet,
    method: 'post',
    data: parameter
  })
}

export function SaveEvaluationFormSet (parameter) {
  return request({
    url: evaluationAPIUrl.saveEvaluationFormSet,
    method: 'post',
    data: parameter
  })
}

export function GetEvaluationMode (parameter) {
  return request({
    url: evaluationAPIUrl.getEvaluationMode,
    method: 'post',
    data: parameter
  })
}

export function SaveEvaluationMode (parameter) {
  return request({
    url: evaluationAPIUrl.saveEvaluationMode,
    method: 'post',
    data: parameter
  })
}
