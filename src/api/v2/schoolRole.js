import request from '@/utils/request'

const API_PREFIX = 'api2/school/role'

export const schoolRoleApi = {
  addRole: `/classcipe/${API_PREFIX}/add`,
  editRole: `/classcipe/${API_PREFIX}/edit`,
  deleteRole: `/classcipe/${API_PREFIX}/delete`,
  listRole: `/classcipe/${API_PREFIX}/list`,
  pageListRole: `/classcipe/${API_PREFIX}/pageList`,
  addRoleUser: `/classcipe/${API_PREFIX}/addUser`,
  deleteRoleUser: `/classcipe/${API_PREFIX}/deleteUser`,
  getRolePermission: `/classcipe/${API_PREFIX}/getPermission`,
  getRoleUsers: `/classcipe/${API_PREFIX}/getUsers`,
  saveRolePermission: `/classcipe/${API_PREFIX}/savePermission`,
  bindRoleSubjectLeader: `/classcipe/${API_PREFIX}/user/bindSubjectLeader`,
  bindRoleClassTeachers: `/classcipe/${API_PREFIX}/user/bindTeachers`,
  getRoleSubjectLeaders: `/classcipe/${API_PREFIX}/user/getSubjectLeaders`,
  getRoleClassTeachers: `/classcipe/${API_PREFIX}/user/getTeachers`
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
  return new Promise((resolve) => {
    resolve({
      code: 0,
      success: true,
      result: [
        { 'roleCode': 'admin', 'name': 'Admin' },
        { 'roleCode': 'head', 'name': 'Head teacher' },
        { 'roleCode': 'leader', 'name': 'Subject leader' },
        { 'roleCode': 'teacher', 'name': 'Teacher' }
      ]
    })
  })
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
  return new Promise((resolve) => {
    resolve({
      code: 0,
      success: true,
      result: {
        total: 4,
        records: [
          { 'roleCode': 'admin', 'name': 'Admin' },
          { 'roleCode': 'head', 'name': 'Head teacher' },
          { 'roleCode': 'leader', 'name': 'Subject leader' }
          // { 'roleCode': 'teacher', 'name': 'Teacher' }
        ]
      }
    })
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

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function deleteRole (parameter) {
  return request({
    url: schoolRoleApi.deleteRole,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function addRoleUser (parameter) {
  return request({
    url: schoolRoleApi.addRoleUser,
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
 export function deleteRoleUser (parameter) {
  return request({
    url: schoolRoleApi.deleteRoleUser,
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
 export function saveRolePermission (parameter) {
  return request({
    url: schoolRoleApi.saveRolePermission,
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
 export function getRoleUsers (parameter) {
  return request({
    url: schoolRoleApi.getRoleUsers,
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
