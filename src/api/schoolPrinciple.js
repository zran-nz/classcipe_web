import request from '@/utils/request'

const API_PREFIX = 'schoolPrinciple'

export const schoolPrincipleApiUrl = {
  SchoolPrincipleList: `/classcipe/school/${API_PREFIX}/list`,
  SchoolPrincipleDelete: `/classcipe/school/${API_PREFIX}/delete`,
  SchoolPrincipleGetBySchoolId: `/classcipe/school/${API_PREFIX}/getBySchoolId`,
  SchoolPrincipleQueryById: `/classcipe/school/${API_PREFIX}/queryById`,
  SchoolPrincipleSave: `/classcipe/school/${API_PREFIX}/save`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SchoolPrincipleSave (parameter) {
  return request({
    url: schoolPrincipleApiUrl.SchoolPrincipleSave,
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
export function SchoolPrincipleList (parameter) {
  return request({
    url: schoolPrincipleApiUrl.SchoolPrincipleList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SchoolPrincipleDelete (parameter) {
  return request({
    url: schoolPrincipleApiUrl.SchoolPrincipleDelete,
    method: 'delete',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function SchoolPrincipleGetBySchoolId (parameter) {
  return request({
    url: schoolPrincipleApiUrl.SchoolPrincipleGetBySchoolId,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function SchoolPrincipleQueryById (parameter) {
  return request({
    url: schoolPrincipleApiUrl.SchoolPrincipleQueryById,
    method: 'get',
    params: parameter
  })
}
