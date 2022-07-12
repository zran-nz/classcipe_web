import request from '@/utils/request'

const API_PREFIX = 'api/contentGrade'

export const ContentGrade = {
  save: `/classcipe/${API_PREFIX}/save`
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
