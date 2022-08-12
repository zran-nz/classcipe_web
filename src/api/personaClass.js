import request from '@/utils/request'

const API_PREFIX = 'personalClass'

export const personalClassApiUrl = {
  AddOrUpdate: `/classcipe/api/${API_PREFIX}/addOrUpdate`,
  AddOrUpdatePersonalClass: `/classcipe/api/${API_PREFIX}/addOrUpdatePersonalClass`,
  Delete: `/classcipe/api/${API_PREFIX}/delete`,
  DeleteBatch: `/classcipe/api/${API_PREFIX}/deleteBatch`,
  List: `/classcipe/api/${API_PREFIX}/list`,
  PersonaClasslist: `/classcipe/api/${API_PREFIX}/personaClasslist`,
  QueryById: `/classcipe/api/${API_PREFIX}/queryById`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function PersonalClassAddOrUpdate (parameter) {
  return request({
    url: personalClassApiUrl.AddOrUpdate,
    method: 'post',
    data: parameter,
    params: parameter,
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
 export function PersonalClassAddOrUpdatePersonalClass (parameter) {
  return request({
    url: personalClassApiUrl.AddOrUpdatePersonalClass,
    method: 'post',
    data: parameter,
    params: parameter,
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
export function PersonalClassList (parameter) {
  return request({
    url: personalClassApiUrl.List,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function PersonalClassPagelist (parameter) {
  return request({
    url: personalClassApiUrl.PersonaClasslist,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function PersonalClassQueryById (parameter) {
  return request({
    url: personalClassApiUrl.QueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function PersonalClassDelete (parameter) {
  return request({
    url: personalClassApiUrl.Delete,
    method: 'delete',
    data: parameter,
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function PersonalClassDeleteBatch (parameter) {
  return request({
    url: personalClassApiUrl.DeleteBatch,
    method: 'delete',
    data: parameter,
    params: parameter
  })
}
