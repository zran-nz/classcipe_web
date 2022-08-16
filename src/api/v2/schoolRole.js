import request from '@/utils/request'

const API_PREFIX = 'api2/school/role'

export const schoolRoleApi = {
  listRole: `/classcipe/${API_PREFIX}/list`,
  pageListRole: `/classcipe/${API_PREFIX}/pageList`,
  getRolePermission: `/classcipe/${API_PREFIX}/getPermission`,
  bindRoleSubjectLeader: `/classcipe/${API_PREFIX}/user/bindSubjectLeader`,
  bindRoleClassTeachers: `/classcipe/${API_PREFIX}/user/bindTeachers`,
  getRoleSubjectLeaders: `/classcipe/${API_PREFIX}/user/getSubjectLeaders`,
  getRoleClassTeachers: `/classcipe/${API_PREFIX}/user/getTeachers`,
  getSchoolRole: `/classcipe/${API_PREFIX}/user/getSchoolRole`,
  saveSchoolRole: `/classcipe/${API_PREFIX}/user/saveSchoolRole`,
  geHeaderClassByUserId: `/classcipe/${API_PREFIX}/user/geHeaderClassByUserId`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function listRole (parameter) {
  // return request({
  //   url: schoolRoleApi.listRole,
  //   method: 'get',
  //   params: parameter
  // })
  // { "admin": "Admin", "leader": "Subject leader", "head": "Head teacher", "teacher": "Teacher" }
  return request({
    url: schoolRoleApi.getSchoolRole,
    method: 'get',
    params: parameter
  }).then(res => {
    const result = res
    if (result.code === 0) {
      const arr = []
      for (const key in result.result.roleNames) {
        if (key !== 'Teacher') {
          arr.push({
            roleCode: key,
            name: result.result.roleNames[key]
          })
        }
      }
      result.result = arr
    }
    return Promise.resolve(result)
  }).catch(err => {
    return Promise.reject(err)
  })
  // return new Promise((resolve) => {
  //   resolve({
  //     code: 0,
  //     success: true,
  //     result: [
  //       { 'roleCode': 'admin', 'name': 'Admin' },
  //       { 'roleCode': 'head', 'name': 'Head teacher' },
  //       { 'roleCode': 'leader', 'name': 'Subject leader' }
  //       // { 'roleCode': 'teacher', 'name': 'Teacher' }
  //     ]
  //   })
  // })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function pageListRole (parameter) {
  // return request({
  //   url: schoolRoleApi.pageListRole,
  //   method: 'get',
  //   params: parameter
  // })
  // return new Promise((resolve) => {
  //   resolve({
  //     code: 0,
  //     success: true,
  //     result: {
  //       total: 3,
  //       records: [
  //         { 'roleCode': 'admin', 'name': 'Admin' },
  //         { 'roleCode': 'head', 'name': 'Head teacher' },
  //         { 'roleCode': 'leader', 'name': 'Subject leader' }
  //         // { 'roleCode': 'teacher', 'name': 'Teacher' }
  //       ]
  //     }
  //   })
  // })
  return request({
    url: schoolRoleApi.getSchoolRole,
    method: 'get',
    params: parameter
  }).then(res => {
    const result = res
    if (result.code === 0) {
      const arr = []
      for (const key in result.result.roleNames) {
        if (key !== 'Teacher') {
          arr.push({
            roleCode: key,
            name: result.result.roleNames[key]
          })
        }
      }
      result.result = {
        total: arr.length,
        records: arr
      }
    }
    return Promise.resolve(result)
  }).catch(err => {
    return Promise.reject(err)
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function getRolePermission (parameter) {
  return request({
    url: schoolRoleApi.getRolePermission,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function bindRoleSubjectLeader (parameter) {
  return request({
    url: schoolRoleApi.bindRoleSubjectLeader,
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
 export function bindRoleClassTeachers (parameter) {
  return request({
    url: schoolRoleApi.bindRoleClassTeachers,
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
 export function getRoleSubjectLeaders (parameter) {
  return request({
    url: schoolRoleApi.getRoleSubjectLeaders,
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
 export function getRoleClassTeachers (parameter) {
  return request({
    url: schoolRoleApi.getRoleClassTeachers,
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
 export function getSchoolRole (parameter) {
  return request({
    url: schoolRoleApi.getSchoolRole,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function saveSchoolRole (parameter) {
  return request({
    url: schoolRoleApi.saveSchoolRole,
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
 export function geHeaderClassByUserId (parameter) {
  return request({
    url: schoolRoleApi.geHeaderClassByUserId,
    method: 'get',
    params: parameter
  })
}
