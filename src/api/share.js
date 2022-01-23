import request from '@/utils/request'

export const shareAPIUrl = {
  shareStatus: '/classcipe/api/contentShare/shareStatus',
  addOrUpdate: '/classcipe/api/contentShare/addOrUpdate',
  queryContentShare: '/classcipe/api/contentShare/queryContentShare',
  resetPassword: '/classcipe/api/contentShare/resetPassword',
  anonGetShareContentDetails: '/classcipe/api/anon/getShareContentDetails',
  getShareInfo: '/classcipe/api/anon/getShareInfo'
}

export function ShareStatus(parameter) {
  return request({
    url: shareAPIUrl.shareStatus,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function ShareAddOrUpdate(parameter) {
  return request({
    url: shareAPIUrl.addOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function QueryContentShare(parameter) {
  return request({
    url: shareAPIUrl.queryContentShare,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function ResetPassword(parameter) {
  return request({
    url: shareAPIUrl.resetPassword,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function AnonGetShareContentDetails (parameter) {
  return request({
    url: shareAPIUrl.anonGetShareContentDetails,
    method: 'get',
    params: parameter
  })
}

export function GetShareInfo (parameter) {
  return request({
    url: shareAPIUrl.getShareInfo,
    method: 'get',
    params: parameter
  })
}
