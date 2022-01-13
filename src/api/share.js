import request from '@/utils/request'

export const userAPIUrl = {
  shareStatus: '/classcipe/api/contentShare/shareStatus',
  addOrUpdate: '/classcipe/api/contentShare/addOrUpdate',
  queryContentShare: '/classcipe/api/contentShare/queryContentShare',
  resetPassword: '/classcipe/api/contentShare/resetPassword'
}

export function ShareStatus(parameter) {
  return request({
    url: userAPIUrl.shareStatus,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function ShareAddOrUpdate(parameter) {
  return request({
    url: userAPIUrl.addOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function QueryContentShare(parameter) {
  return request({
    url: userAPIUrl.queryContentShare,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function ResetPassword(parameter) {
  return request({
    url: userAPIUrl.resetPassword,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
