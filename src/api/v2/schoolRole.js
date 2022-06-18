import request from '@/utils/request'

const API_PREFIX = 'api2/school/role'

export const schoolRoleApi = {
  addRole: `/classcipe/${API_PREFIX}/add`,
  editRole: `/classcipe/${API_PREFIX}/edit`,
  listRole: `/classcipe/${API_PREFIX}/list`,
  pageListRole: `/classcipe/${API_PREFIX}/pageList`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function listRole (parameter) {
  return request({
    url: schoolRoleApi.listRole,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function pageListRole (parameter) {
  return request({
    url: schoolRoleApi.pageListRole,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function addRole (parameter) {
  return request({
    url: schoolRoleApi.addRole,
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
 export function editRole (parameter) {
  return request({
    url: schoolRoleApi.editRole,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
