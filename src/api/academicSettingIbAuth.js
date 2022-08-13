import request from '@/utils/request'

const API_PREFIX = 'academic/academicSettingIbAuth'

export const AcademicSettingIbAuth = {
  listIbAuth: `/classcipe/${API_PREFIX}/list`,
  getAcademicSettingIbAuth: `/classcipe/${API_PREFIX}/getAcademicSettingIbAuth`,
  submitIbAuth: `/classcipe/${API_PREFIX}/submit`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function listIbAuth (parameter) {
  return request({
    url: AcademicSettingIbAuth.listIbAuth,
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
export function getAcademicSettingIbAuth (parameter) {
  return request({
    url: AcademicSettingIbAuth.getAcademicSettingIbAuth,
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
 export function submitIbAuth (parameter) {
  return request({
    url: AcademicSettingIbAuth.submitIbAuth,
    method: 'post',
    data: parameter
  })
}
