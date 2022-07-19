import request from '@/utils/request'

const API_PREFIX = 'plan/planSpace'

export const schoolRoleApi = {
  getAllPlanSpace: `/classcipe/${API_PREFIX}/getAll`,
  delSpaceContents: `/classcipe/${API_PREFIX}/contents/delete`,
  listPlanSpaceContent: `/classcipe/${API_PREFIX}/list/content`,
  listPlanSpaceSession: `/classcipe/${API_PREFIX}/list/session`,
  savePlanSpace: `/classcipe/${API_PREFIX}/save`,
  delSpaceSessions: `/classcipe/${API_PREFIX}/sessions/delete`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function listPlanSpaceContent (parameter) {
  return request({
    url: schoolRoleApi.listPlanSpaceContent,
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
 export function listPlanSpaceSession (parameter) {
  return request({
    url: schoolRoleApi.listPlanSpaceSession,
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
 export function delSpaceContents (parameter) {
  return request({
    url: schoolRoleApi.delSpaceContents,
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
 export function getAllPlanSpace (parameter) {
  return request({
    url: schoolRoleApi.getAllPlanSpace,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function savePlanSpace (parameter) {
  return request({
    url: schoolRoleApi.savePlanSpace,
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
 export function delSpaceSessions (parameter) {
  return request({
    url: schoolRoleApi.delSpaceSessions,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
