import request from '@/utils/request'

export const curriculumAPIUrl = {
  CurriculumAddOrUpdate: '/classcipe/api/curriculum/addOrUpdate',
  CurriculumQueryById: '/classcipe/api/curriculum/queryById',
  CurriculumDelete: '/classcipe/api/curriculum/delete',
  CurriculumDeleteBatch: '/classcipe/api/curriculum/deleteBatch',
  CurriculumList: '/classcipe/api/curriculum/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function CurriculumAddOrUpdate (parameter) {
  return request({
    url: curriculumAPIUrl.CurriculumAddOrUpdate,
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
export function CurriculumQueryById (parameter) {
  return request({
    url: curriculumAPIUrl.CurriculumQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function CurriculumDelete (parameter) {
  return request({
    url: curriculumAPIUrl.CurriculumDelete,
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
export function CurriculumDeleteBatch (parameter) {
  return request({
    url: curriculumAPIUrl.CurriculumDeleteBatch,
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
export function CurriculumList (parameter) {
  return request({
    url: curriculumAPIUrl.CurriculumList,
    method: 'get',
    params: parameter
  })
}
