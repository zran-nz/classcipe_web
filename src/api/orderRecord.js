import request from '@/utils/request'

const API_PREFIX = 'orderRecord'

export const baseApiUrl = {
  list: `/classcipe/api/${API_PREFIX}/list`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function orderRecordList (parameter) {
  return request({
    url: baseApiUrl.list,
    method: 'get',
    params: parameter
  })
}
