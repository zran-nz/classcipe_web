import request from '@/utils/request'

export const userAPIUrl = {
  EditUser: '/classcipe/sys/user/edit',
  SearchUser: '/classcipe/sys/user/queryUserByName',
  AddUserCollaborate: '/classcipe/api/collaborate/addOrUpdate',
  GetCollaborateUsers: '/classcipe/api/collaborate/getCollaborateUsers',
  GetShared: '/classcipe/api/collaborate/getShared',
  DeleteSharedByIdAndType: '/classcipe/api/collaborate/deleteByIdAndType',
  UserSetting: '/classcipe/sys/user/setting',
  SwitchUserModeSchool: '/classcipe/sys/switchSchool',
  SetCompleteGuide: '/classcipe/sys/user/setCompleteGuide',
  GetCompleteGuide: '/classcipe/sys/user/getCompleteGuide'
}

/**
 *
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function editUser (parameter) {
  return request({
    url: userAPIUrl.EditUser,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function AddUserCollaborate (parameter) {
  return request({
    url: userAPIUrl.AddUserCollaborate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function GetCollaborateUsers (parameter) {
  return request({
    url: userAPIUrl.GetCollaborateUsers,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetShared (parameter) {
  return request({
    url: userAPIUrl.GetShared,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SearchUser (parameter) {
  return request({
    url: userAPIUrl.SearchUser,
    method: 'get',
    params: parameter
  })
}

export function DeleteSharedByIdAndType (parameter) {
  return request({
    url: userAPIUrl.DeleteSharedByIdAndType,
    method: 'post',
    data: parameter
  })
}

export function UserSetting (parameter) {
  return request({
    url: userAPIUrl.UserSetting,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function SwitchUserModeSchool (parameter) {
  return request({
    url: userAPIUrl.SwitchUserModeSchool,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 *
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function SetCompleteGuide (parameter) {
  return request({
    url: userAPIUrl.SetCompleteGuide,
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
 export function GetCompleteGuide (parameter) {
  return request({
    url: userAPIUrl.GetCompleteGuide,
    method: 'get',
    params: parameter
  })
}
