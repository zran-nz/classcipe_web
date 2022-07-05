/*
 * @Author: jacob
 * @Date: 2022-07-04 09:39:45
 * @LastEditors: jacob
 * @LastEditTime: 2022-07-05 14:19:36
 * @Description:
 */
import request from '@/utils/request'

const API_PREFIX = 'api/teacherVerification'

export const teacherVerificationApi = {
  checkServiceVerification: `/classcipe/${API_PREFIX}/checkServiceVerification`,
  checkTeacherVerification: `/classcipe/${API_PREFIX}/checkTeacherVerification`,
  detailVertificationById: `/classcipe/${API_PREFIX}/detailById`,
  listVeritification: `/classcipe/${API_PREFIX}/list`,
  saveServiceVerification: `/classcipe/${API_PREFIX}/saveServiceVerification`,
  saveTeacherVerification: `/classcipe/${API_PREFIX}/saveTeacherVerification`,
  detailVerificationByUserId: `/classcipe/${API_PREFIX}/detailByUserId`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function checkServiceVerification (parameter) {
  return request({
    url: teacherVerificationApi.checkServiceVerification,
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
 export function checkTeacherVerification (parameter) {
  return request({
    url: teacherVerificationApi.checkTeacherVerification,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function saveTeacherVerification (parameter) {
  return request({
    url: teacherVerificationApi.saveTeacherVerification,
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
 export function saveServiceVerification (parameter) {
  return request({
    url: teacherVerificationApi.saveServiceVerification,
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
 export function listVeritification (parameter) {
  return request({
    url: teacherVerificationApi.listVeritification,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function detailVertificationById (parameter) {
  return request({
    url: teacherVerificationApi.detailVertificationById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function detailVerificationByUserId (parameter) {
  return request({
    url: teacherVerificationApi.detailVerificationByUserId,
    method: 'get',
    params: parameter
  })
}
