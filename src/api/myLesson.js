import request from '@/utils/request'

export const lessonAPIUrl = {
  createLessonPPT: '/classcipe/api/lesson/createLessonPPT',
  addOrUpdate: '/classcipe/api/lesson/addOrUpdate',
  delete: '/classcipe/api/lesson/delete',
  deleteBatch: '/classcipe/api/lesson/deleteBatch',
  list: '/classcipe/api/lesson/list',
  queryById: '/classcipe/api/lesson/queryById'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function LessonCreateLessonPPT (parameter) {
  return request({
    url: lessonAPIUrl.createLessonPPT,
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
export function LessonAddOrUpdate (parameter) {
  return request({
    url: lessonAPIUrl.addOrUpdate,
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
export function LessonQueryById (parameter) {
  return request({
    url: lessonAPIUrl.queryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function LessonDelete (parameter) {
  return request({
    url: lessonAPIUrl.delete + '?id=' + parameter.id,
    method: 'delete',
    data: parameter
  })
}
