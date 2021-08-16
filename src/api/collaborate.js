import request from '@/utils/request'

export const userAPIUrl = {
  InviteCollaborate: '/classcipe/api/collaborate/invite',
  GetCollaborateUsers: '/classcipe/api/collaborate/getCollaborateUsers',
  GetShared: '/classcipe/api/collaborate/getShared',
  GetSharedNotReceived: '/classcipe/api/collaborate/getSharedNotReceived',
  GetFindSharedNotReceived: '/classcipe/api/collaborate/getFindSharedNotReceived',
  DeleteCollaborate: '/classcipe/api/collaborate/delete',
  ReceiveCollaborate: '/classcipe/api/collaborate/receive'
}

export function InviteCollaborate (parameter) {
  return request({
    url: userAPIUrl.InviteCollaborate,
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

export function GetSharedNotReceived (parameter) {
  return request({
    url: userAPIUrl.GetSharedNotReceived,
    method: 'get',
    params: parameter
  })
}

export function GetFindSharedNotReceived (parameter) {
  return request({
    url: userAPIUrl.GetFindSharedNotReceived,
    method: 'get',
    params: parameter
  })
}

export function DeleteCollaborate (parameter) {
  return request({
    url: userAPIUrl.DeleteCollaborate,
    method: 'post',
    data: parameter
  })
}

export function ReceiveCollaborate (parameter) {
  return request({
    url: userAPIUrl.ReceiveCollaborate,
    method: 'post',
    data: parameter
  })
}
