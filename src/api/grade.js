import request from '@/utils/request'

export const gradeAPIUrl = {
  GradeAddOrUpdate: '/classcipe/api/grade/addOrUpdate',
  GradeQueryById: '/classcipe/api/grade/queryById',
  GradeDelete: '/classcipe/api/grade/delete',
  GradeDeleteBatch: '/classcipe/api/grade/deleteBatch',
  GradeList: '/classcipe/api/grade/list',
  GradeBySchoolId: '/classcipe/api/grade/getGradesBySchoolId'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GradeAddOrUpdate (parameter) {
  return request({
    url: gradeAPIUrl.GradeAddOrUpdate,
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
export function GradeQueryById (parameter) {
  return request({
    url: gradeAPIUrl.GradeQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GradeDelete (parameter) {
  return request({
    url: gradeAPIUrl.GradeDelete,
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
export function GradeDeleteBatch (parameter) {
  return request({
    url: gradeAPIUrl.GradeDeleteBatch,
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
export function GradeList (parameter) {
  return request({
    url: gradeAPIUrl.GradeList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function getGradeListBySchoolId (parameter) {
  return request({
    url: gradeAPIUrl.GradeBySchoolId,
    method: 'get',
    params: parameter
  })
}
