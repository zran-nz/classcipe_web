import request from '@/utils/request'

export const schoolGroupAPIUrl = {
  getSchoolGroupList: '/classcipe/api/school/group/list',
  addOrUpdateGroup: '/classcipe/api/school/group/addOrUpdate',
  getSchoolGroupMembers: '/classcipe/api/school/group/listGroupMembers',
  addSchoolGroupMembers: '/classcipe/api/school/group/addGroupMember',
  removeSchoolGroupMembers: '/classcipe/api/school/group/removeGroupMember'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function getSchoolGroupList (parameter) {
  return request({
    url: schoolGroupAPIUrl.getSchoolGroupList,
    method: 'get',
    params: parameter
  })
}
export function addOrUpdateGroup (parameter) {
  return request({
    url: schoolGroupAPIUrl.addOrUpdateGroup,
    method: 'post',
    data: parameter
  })
}
export function getSchoolGroupMembers (parameter) {
  return request({
    url: schoolGroupAPIUrl.getSchoolGroupMembers,
    method: 'get',
    params: parameter
  })
}
export function addSchoolGroupMembers (parameter) {
  return request({
    url: schoolGroupAPIUrl.addSchoolGroupMembers,
    method: 'get',
    params: parameter
  })
}
export function removeSchoolGroupMembers (parameter) {
  return request({
    url: schoolGroupAPIUrl.removeSchoolGroupMembers,
    method: 'get',
    params: parameter
  })
}
