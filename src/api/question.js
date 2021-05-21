import request from '@/utils/request'

export const questionAPIUrl = {
  QuestionAddOrUpdate: '/classcipe/api/question/addOrUpdate',
  QuestionQueryById: '/classcipe/api/question/queryById',
  QuestionDelete: '/classcipe/api/question/delete',
  QuestionDeleteBatch: '/classcipe/api/question/deleteBatch',
  QuestionList: '/classcipe/api/question/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function QuestionAddOrUpdate (parameter) {
  return request({
    url: questionAPIUrl.QuestionAddOrUpdate,
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
export function QuestionQueryById (parameter) {
  return request({
    url: questionAPIUrl.QuestionQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function QuestionDelete (parameter) {
  return request({
    url: questionAPIUrl.QuestionDelete,
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
export function QuestionDeleteBatch (parameter) {
  return request({
    url: questionAPIUrl.QuestionDeleteBatch,
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
export function QuestionList (parameter) {
  return request({
    url: questionAPIUrl.QuestionList,
    method: 'get',
    params: parameter
  })
}
