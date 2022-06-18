import request from '@/utils/request'

export const AssessmentUrl = {
  assessmentToolHeaderNamesSave: '/classcipe/assessment/assessmentToolHeaderNames/save',
  assessmentToolHeaderNamesList: '/classcipe/assessment/assessmentToolHeaderNames/list/my',
  assessmentToolHeaderNamesDelete: '/classcipe/assessment/assessmentToolHeaderNames/delete',
  assessmentToolInfoSave: '/classcipe/assessment/assessmentToolInfo/save',
  assessmentToolInfoSaveBatch: '/classcipe/assessment/assessmentToolInfo/saveBatch',
  assessmentToolInfoList: '/classcipe/assessment/assessmentToolInfo/list',
  assessmentToolInfoDelete: '/classcipe/assessment/assessmentToolInfo/delete'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function AssessmentToolHeaderNamesSave (parameter) {
  return request({
    url: AssessmentUrl.assessmentToolHeaderNamesSave,
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
export function AssessmentToolHeaderNamesList (parameter) {
  return request({
    url: AssessmentUrl.assessmentToolHeaderNamesList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function AssessmentToolHeaderNamesDelete (parameter) {
  return request({
    url: AssessmentUrl.assessmentToolHeaderNamesDelete,
    method: 'delete',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function AssessmentToolInfoSave (parameter) {
  return request({
    url: AssessmentUrl.assessmentToolInfoSave,
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
export function AssessmentToolInfoSaveBatch (parameter) {
  return request({
    url: AssessmentUrl.assessmentToolInfoSaveBatch,
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
export function AssessmentToolInfoList (parameter) {
  return request({
    url: AssessmentUrl.assessmentToolInfoList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function AssessmentToolInfoDelete (parameter) {
  return request({
    url: AssessmentUrl.assessmentToolInfoDelete,
    method: 'delete',
    params: parameter
  })
}
