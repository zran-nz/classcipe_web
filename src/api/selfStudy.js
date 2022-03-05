import request from '@/utils/request'

const API_PREFIX = 'selfStudy'

export const selfStudyApiUrl = {
  TaskBye: `/classcipe/api/${API_PREFIX}/task/bye`,
  TaskList: `/classcipe/api/${API_PREFIX}/task/list`,
  TaskStart: `/classcipe/api/${API_PREFIX}/task/start`,
  TaskAchive: `/classcipe/api/${API_PREFIX}/archive`,
  TaskDelete: `/classcipe/api/${API_PREFIX}/delete`,
  TaskResotre: `/classcipe/api/${API_PREFIX}/restore`
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
