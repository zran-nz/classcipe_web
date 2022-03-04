import request from '@/utils/request'

const API_PREFIX = 'selfStudy'

export const selfStudyApiUrl = {
  TaskBye: `/classcipe/api/${API_PREFIX}/task/bye`,
  TaskList: `/classcipe/api/${API_PREFIX}/task/list`,
  TaskStart: `/classcipe/api/${API_PREFIX}/task/start`
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
