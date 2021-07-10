import request from '@/utils/request'

export const taskAPIUrl = {
  createTaskPPT: '/classcipe/api/task/createTaskPPT',
  addOrUpdate: '/classcipe/api/task/addOrUpdate',
  delete: '/classcipe/api/task/delete',
  deleteBatch: '/classcipe/api/task/deleteBatch',
  list: '/classcipe/api/task/list',
  queryById: '/classcipe/api/task/queryById'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TaskCreateTaskPPT (parameter) {
  return request({
    url: taskAPIUrl.createTaskPPT,
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
export function TaskAddOrUpdate (parameter) {
  return request({
    url: taskAPIUrl.addOrUpdate,
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
export function TaskQueryById (parameter) {
  return request({
    url: taskAPIUrl.queryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TaskDelete (parameter) {
  return request({
    url: taskAPIUrl.delete + '?id=' + parameter.id,
    method: 'delete',
    data: parameter
  })
}
