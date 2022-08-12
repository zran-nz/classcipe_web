import request from '@/utils/request'

const API_PREFIX = 'selfStudy'

export const selfStudyApiUrl = {
  TaskBye: `/classcipe/api/${API_PREFIX}/task/bye`,
  TaskList: `/classcipe/api/${API_PREFIX}/task/list`,
  TaskStart: `/classcipe/api/${API_PREFIX}/task/start`,
  TaskAchive: `/classcipe/api/${API_PREFIX}/archive`,
  TaskDelete: `/classcipe/api/${API_PREFIX}/delete`,
  TaskResotre: `/classcipe/api/${API_PREFIX}/restore`,
  StudentClasses: `/classcipe/api/${API_PREFIX}/getStudentClasses`,
  getClassSchedule: `/classcipe/api/${API_PREFIX}/getClassSchedule`,
  queryMySessions: `/classcipe/api/${API_PREFIX}/queryMySessions`,
  SchoolTaskList: `/classcipe/api/${API_PREFIX}/schoolTask/list`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SelfStudyTaskBye (parameter) {
  return request({
    url: selfStudyApiUrl.TaskBye,
    method: 'post',
    data: parameter,
    params: parameter,
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
export function SelfStudyTaskStart (parameter) {
  return request({
    url: selfStudyApiUrl.TaskStart,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SelfStudyTaskList (parameter) {
  return request({
    url: selfStudyApiUrl.TaskList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function SelfStudyAchive (parameter) {
  return request({
    url: selfStudyApiUrl.TaskAchive,
    method: 'post',
    data: parameter,
    params: parameter,
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
 export function SelfStudyRestore (parameter) {
  return request({
    url: selfStudyApiUrl.TaskResotre,
    method: 'post',
    data: parameter,
    params: parameter,
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
 export function SelfStudyDelete (parameter) {
  return request({
    url: selfStudyApiUrl.TaskDelete,
    method: 'post',
    data: parameter,
    params: parameter,
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
 export function StudentClasses (parameter) {
  return request({
    url: selfStudyApiUrl.StudentClasses,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function getClassSchedule (parameter) {
  return request({
    url: selfStudyApiUrl.getClassSchedule,
    method: 'post',
    data: parameter,
    params: parameter,
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
 export function queryMySessions (parameter) {
  return request({
    url: selfStudyApiUrl.queryMySessions,
    method: 'post',
    data: parameter,
    params: parameter,
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
 export function SchoolTaskList (parameter) {
  return request({
    url: selfStudyApiUrl.SchoolTaskList,
    method: 'post',
    data: parameter,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
