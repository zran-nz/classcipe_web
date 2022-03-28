import request from '@/utils/request'

export const schoolUserAPIUrl = {
  getSchoolRoleList: '/classcipe/api/school/role/getRoles',
  getSchoolClassList: '/classcipe/api/school/class/list',

  addStaff: '/classcipe/api/school/user/addStaff',
  addStudent: '/classcipe/api/school/user/addStudents',
  getOrCreateInvite: '/classcipe/api/school/user/getOrCreateInvite',
  checkInvite: '/classcipe/api/school/user/checkInvite',
  acceptInvite: '/classcipe/api/school/user/acceptInvite',
  updateInvite: '/classcipe/api/school/user/updateInvite',
  getSchoolUsers: '/classcipe/api/school/user/getSchoolUsers',
  queryUser: '/classcipe/api/school/user/queryUser',
  updateUserStatus: '/classcipe/api/school/user/updateUserStatus',
  importStaff: '/classcipe/api/school/user/importStaffByExcel',
  importStudent: '/classcipe/api/school/user/importStudentByExcel',
  exportInvalidStaff: '/classcipe/api/school/user/exportInvalidStaff',
  exportInvalidStudent: '/classcipe/api/school/user/exportInvalidStudent',
  removeSchoolUser: '/classcipe/api/school/user/removeSchoolUser'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function getSchoolRoleList (parameter) {
  return request({
    url: schoolUserAPIUrl.getSchoolRoleList,
    method: 'get',
    params: parameter
  })
}
export function getSchoolClassList (parameter) {
  return request({
    url: schoolUserAPIUrl.getSchoolClassList,
    method: 'get',
    params: parameter
  })
}
export function addStaff (parameter) {
  return request({
    url: schoolUserAPIUrl.addStaff,
    method: 'post',
    params: parameter
  })
}
export function addStudent (parameter) {
  return request({
    url: schoolUserAPIUrl.addStudent,
    method: 'post',
    params: parameter
  })
}
export function getOrCreateInvite (parameter) {
  return request({
    url: schoolUserAPIUrl.getOrCreateInvite,
    method: 'post',
    params: parameter
  })
}
export function checkInvite (parameter) {
  return request({
    url: schoolUserAPIUrl.checkInvite,
    method: 'get',
    params: parameter
  })
}
export function acceptInvite (parameter) {
  return request({
    url: schoolUserAPIUrl.acceptInvite,
    method: 'post',
    params: parameter
  })
}
export function updateInvite (parameter) {
  return request({
    url: schoolUserAPIUrl.updateInvite,
    method: 'post',
    params: parameter
  })
}
export function getSchoolUsers (parameter) {
  return request({
    url: schoolUserAPIUrl.getSchoolUsers,
    method: 'get',
    params: parameter
  })
}
export function queryUser (parameter) {
  return request({
    url: schoolUserAPIUrl.queryUser,
    method: 'get',
    params: parameter
  })
}
export function updateUserStatus (parameter) {
  return request({
    url: schoolUserAPIUrl.updateUserStatus,
    method: 'post',
    params: parameter
  })
}

export function removeSchoolUser (parameter) {
  return request({
    url: schoolUserAPIUrl.removeSchoolUser,
    method: 'post',
    params: parameter
  })
}
