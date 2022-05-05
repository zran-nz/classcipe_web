import request from '@/utils/request'

export const ClassesV2Url = {
  findClassSessions: '/classcipe/api/v2/classes/findClassSessions',
  myClassesList: '/classcipe/api/v2/classes/myClassesList',
  findWorkShops: '/classcipe/api/v2/live/findWorkShops',
  addQuickSession: '/classcipe/api/v2/schedule/addQucikSession',
  addSession: '/classcipe/api/v2/schedule/addSession',
  getClassesStudent: '/classcipe/api/v2/classes/getClassesStudent'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function findClassSessionsV2 (parameter) {
  return request({
    url: ClassesV2Url.findClassSessions,
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
export function myClassesList (parameter) {
  return request({
    url: ClassesV2Url.myClassesList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function findWorkShopsV2 (parameter) {
  return request({
    url: ClassesV2Url.findWorkShops,
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
export function addQuickSessionV2 (parameter) {
  return request({
    url: ClassesV2Url.addQuickSession,
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
export function AddSessionV2 (parameter) {
  return request({
    url: ClassesV2Url.addSession,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getClassesStudent (parameter) {
  return request({
    url: ClassesV2Url.getClassesStudent,
    method: 'get',
    params: parameter
  })
}
