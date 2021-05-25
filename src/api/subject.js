import request from '@/utils/request'

export const subjectAPIUrl = {
  SubjectTree: '/classcipe/api/subject/tree',
  SubjectAddOrUpdate: '/classcipe/api/subject/addOrUpdate',
  SubjectQueryById: '/classcipe/api/subject/queryById',
  SubjectDelete: '/classcipe/api/subject/delete',
  SubjectDeleteBatch: '/classcipe/api/subject/deleteBatch',
  SubjectList: '/classcipe/api/subject/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SubjectTree (parameter) {
  return request({
    url: subjectAPIUrl.SubjectTree,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SubjectAddOrUpdate (parameter) {
  return request({
    url: subjectAPIUrl.SubjectAddOrUpdate,
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
export function SubjectQueryById (parameter) {
  return request({
    url: subjectAPIUrl.SubjectQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SubjectDelete (parameter) {
  return request({
    url: subjectAPIUrl.SubjectDelete,
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
export function SubjectDeleteBatch (parameter) {
  return request({
    url: subjectAPIUrl.SubjectDeleteBatch,
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
export function SubjectList (parameter) {
  return request({
    url: subjectAPIUrl.SubjectList,
    method: 'get',
    params: parameter
  })
}
