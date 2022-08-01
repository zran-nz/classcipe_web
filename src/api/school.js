import request from '@/utils/request'
import { trimParams } from '@/utils/util'

export const schoolAPIUrl = {
  getSchools: '/classcipe/api/school/getSchools',
  getSchoolList: '/classcipe/api/school/list',
  createSchool: '/classcipe/api/school/create',
  queryById: '/classcipe/api/school/queryById',
  updateSchool: '/classcipe/api/school/addOrUpdate'
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
  // 去除空格
  parameter = trimParams(parameter)
  return request({
    url: schoolAPIUrl.createSchool,
    method: 'post',
    params: parameter,
    data: parameter
  })
}
export function queryById (parameter) {
  return request({
    url: schoolAPIUrl.queryById,
    method: 'get',
    params: parameter
  })
}

export function updateSchool (parameter) {
  // 去除空格
  parameter = trimParams(parameter)
  return request({
    url: schoolAPIUrl.updateSchool,
    method: 'post',
    params: parameter,
    data: parameter
  })
}
