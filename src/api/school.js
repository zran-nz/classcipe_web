import request from '@/utils/request'

export const schoolAPIUrl = {
  getSchools: '/classcipe/api/school/getSchools',
  getSchoolList: '/classcipe/api/school/list',
  createSchool: '/classcipe/api/school/create'
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
    params: parameter
  })
}
export function getSchoolList (parameter) {
  return request({
    url: schoolAPIUrl.getSchoolList,
    method: 'get',
    params: parameter
  })
}
export function createSchool (parameter) {
  return request({
    url: schoolAPIUrl.createSchool,
    method: 'post',
    params: parameter,
    data: parameter
  })
}
