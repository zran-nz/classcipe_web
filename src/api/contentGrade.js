import request from '@/utils/request'

const API_PREFIX = 'api/contentGrade'

export const ContentGrade = {
  save: `/classcipe/${API_PREFIX}/save`,
  getStatByContentId: `/classcipe/${API_PREFIX}/getStatByContentId`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ContentGradeSave (parameter) {
  return request({
    url: ContentGrade.save,
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
export function getStatByContentId (parameter) {
  return request({
    url: ContentGrade.getStatByContentId,
    method: 'get',
    params: parameter
  })
}
