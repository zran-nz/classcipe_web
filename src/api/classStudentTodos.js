import request from '@/utils/request'

const API_PREFIX = 'classStudentTodos'

export const classStudentTodos = {
  listByClassId: `/classcipe/api/${API_PREFIX}/listByClassId`,
  list: `/classcipe/api/${API_PREFIX}/list`,
  save: `/classcipe/api/${API_PREFIX}/save`,
  done: `/classcipe/api/${API_PREFIX}/done`,
  todo: `/classcipe/api/${API_PREFIX}/todo`,
  delete: `/classcipe/api/${API_PREFIX}/delete`,
  deleteBatch: `/classcipe/api/${API_PREFIX}/deleteBatch`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function listByClassId (parameter) {
  return request({
    url: classStudentTodos.listByClassId,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function list (parameter) {
  return request({
    url: classStudentTodos.list,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function save (parameter) {
  return request({
    url: classStudentTodos.save,
    method: 'post',
    data: parameter,
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function done (parameter) {
  return request({
    url: classStudentTodos.done,
    method: 'post',
    data: parameter,
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function todo (parameter) {
  return request({
    url: classStudentTodos.todo,
    method: 'post',
    data: parameter,
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function todoDelete (parameter) {
  return request({
    url: classStudentTodos.delete,
    method: 'delete',
    data: parameter,
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function todoDeleteBatch (parameter) {
  return request({
    url: classStudentTodos.todoDeleteBatch,
    method: 'delete',
    data: parameter,
    params: parameter
  })
}
