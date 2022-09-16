import request from '@/utils/request'

export const userAPIUrl = {
  InviteCollaborate: '/classcipe/api/collaborate/invite',
  GetCollaborateUsers: '/classcipe/api/collaborate/getCollaborateUsers',
  GetShared: '/classcipe/api/collaborate/getShared',
  GetSharedNotReceived: '/classcipe/api/collaborate/getSharedNotReceived',
  GetFindSharedNotReceived: '/classcipe/api/collaborate/getFindSharedNotReceived',
  DeleteCollaborate: '/classcipe/api/collaborate/delete',
  DeleteByMeCollaborate: '/classcipe/api/collaborate/deleteByMe',
  ReceiveCollaborate: '/classcipe/api/collaborate/receive',
  // TODO mock接口，待修改
  GetCollaborateComment: '/classcipe/api/editMessage/queryNewMessage',
  DeleteCollaborateCommentById: '/classcipe/api/editMessage/delete',
  MarkedCollaborateComment: '/classcipe/api/editMessage/marked',
  AddCollaborateComment: '/classcipe/api/editMessage/addMessage',
  GetCollaborateModifiedHistory: '/classcipe/api/editMessage/queryHistory',
  // 新接口
  QueryContentCollaborates: '/classcipe/api/collaborate/v2/queryContentCollaborates',
  CollaboratesSearchUser: '/classcipe/api/collaborate/v2/searchUser',
  CollaboratesInvite: '/classcipe/api/collaborate/v2/invite',
  CollaboratesAgree: '/classcipe/api/collaborate/v2/agree',
  CollaboratesUpdate: '/classcipe/api/collaborate/v2/updateCollaborate',
  CollaboratesRemove: '/classcipe/api/collaborate/v2/remove',
  CollaboratesDeleteByOthers: '/classcipe/api/collaborate/v2/deleteByOthers',
  CollaboratesUpdateLink: '/classcipe/api/collaborate/v2/updateLink',
  CollaboratesQueryShared: '/classcipe/api/collaborate/v2/queryShared',
  CollaboratesQuerySharedOwner: '/classcipe/api/collaborate/v2/querySharedOwner',
  QueryByLinkCode: '/classcipe/api/collaborate/v2/queryByLinkCode',
  CollaboratesApply: '/classcipe/api/collaborate/v2/apply',
  CollaboratesSendInviteEmail: '/classcipe/api/collaborate/v2/sendInviteEmail'
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

export function DeleteByMeCollaborate (parameter) {
  return request({
    url: userAPIUrl.DeleteByMeCollaborate,
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

export function GetCollaborateComment (parameter) {
  return request({
    url: userAPIUrl.GetCollaborateComment,
    method: 'post',
    data: parameter
  })
}
export function DeleteCollaborateCommentById (parameter) {
  return request({
    url: userAPIUrl.DeleteCollaborateCommentById + '?id=' + parameter.id,
    method: 'post',
    data: parameter
  })
}
export function AddCollaborateComment (parameter) {
  return request({
    url: userAPIUrl.AddCollaborateComment,
    method: 'post',
    data: parameter
  })
}
export function GetCollaborateModifiedHistory (parameter) {
  return request({
    url: userAPIUrl.GetCollaborateModifiedHistory,
    method: 'post',
    data: parameter
  })
}

export function QueryContentCollaborates (parameter) {
  return request({
    url: userAPIUrl.QueryContentCollaborates,
    method: 'get',
    params: parameter
  })
}

export function CollaboratesSearchUser (parameter) {
  return request({
    url: userAPIUrl.CollaboratesSearchUser,
    method: 'get',
    params: parameter
  })
}

export function CollaboratesInvite (parameter) {
  return request({
    url: userAPIUrl.CollaboratesInvite,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesAgree (parameter) {
  return request({
    url: userAPIUrl.CollaboratesAgree,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesUpdate (parameter) {
  return request({
    url: userAPIUrl.CollaboratesUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesUpdateLink (parameter) {
  return request({
    url: userAPIUrl.CollaboratesUpdateLink,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesQueryShared (parameter) {
  return request({
    url: userAPIUrl.CollaboratesQueryShared,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesQuerySharedOwner (parameter) {
  return request({
    url: userAPIUrl.CollaboratesQuerySharedOwner,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesQueryByLinkCode (parameter) {
  return request({
    url: userAPIUrl.QueryByLinkCode,
    method: 'get',
    params: parameter
  })
}

export function CollaboratesApply (parameter) {
  return request({
    url: userAPIUrl.CollaboratesApply,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function MarkedCollaborateComment (parameter) {
  return request({
    url: userAPIUrl.MarkedCollaborateComment + '?id=' + parameter.id,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesSendInviteEmail (parameter) {
  return request({
    url: userAPIUrl.CollaboratesSendInviteEmail,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesRemove (parameter) {
  return request({
    url: userAPIUrl.CollaboratesRemove,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function CollaboratesDeleteByOthers (parameter) {
  return request({
    url: userAPIUrl.CollaboratesDeleteByOthers,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
