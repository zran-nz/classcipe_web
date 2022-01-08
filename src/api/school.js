import request from '@/utils/request'

export const schoolAPIUrl = {
  getSchools: '/classcipe/api/school/getSchools'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function getSchools (parameter) {
  return request({
    url: schoolAPIUrl.getSchools,
    method: 'get',
    data: parameter
  })
}
