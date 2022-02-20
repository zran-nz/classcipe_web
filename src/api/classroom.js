import request from '@/utils/request'

export const classRoomAPIUrl = {
  queryByClassInfoSlideId: '/classcipe/api/classRoom/queryByClassInfoSlideId',
  changeClassStatus: '/classcipe/api/classRoom/changeClassStatus',
  queryCommentsByClassId: '/classcipe/api/classRoom/queryCommentsByClassId',
  queryPresentationCommentsByClassId: '/classcipe/api/classRoom/queryPresentationCommentsByClassId',
  queryResponseByClassId: '/classcipe/api/classRoom/queryResponseByClassId',
  addOrUpdateClass: '/classcipe/api/classRoom/addOrUpdateClass',
  FindNewClasses: '/classcipe/api/classRoom/findNewClasses',
  StartOpenSession: '/classcipe/api/classRoom/startOpenSession'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryByClassInfoSlideId (parameter) {
  return request({
    url: classRoomAPIUrl.queryByClassInfoSlideId,
    method: 'get',
    params: parameter
  })
}

export function ChangeClassStatus (parameter) {
  return request({
    url: classRoomAPIUrl.changeClassStatus,
    method: 'get',
    params: parameter
  })
}

export function AddOrUpdateClass (parameter) {
  return request({
    url: classRoomAPIUrl.addOrUpdateClass,
    method: 'post',
    data: parameter
  })
}

export function QueryCommentsByClassId (parameter) {
  return request({
    url: classRoomAPIUrl.queryCommentsByClassId,
    method: 'get',
    params: parameter
  })
}

export function QueryPresentationCommentsByClassId (parameter) {
  return request({
    url: classRoomAPIUrl.queryPresentationCommentsByClassId,
    method: 'get',
    params: parameter,
    headers: {
      'X-Access-Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDIxNDk4NzQsInVzZXJuYW1lIjoiay5saXUyMzY5QGdtYWlsLmNvbSJ9.EzJIOsijuZz4U_wlIYd2SImK94nxBNxD-7aPUXvAwi0' // TODO 删除写死的TOKEN
    }
  })
}

export function QueryResponseByClassId (parameter) {
  return request({
    url: classRoomAPIUrl.queryResponseByClassId,
    method: 'get',
    params: parameter
  })
}

export function FindNewClasses (parameter) {
  return request({
    url: classRoomAPIUrl.FindNewClasses,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function StartOpenSession (parameter) {
  return request({
    url: classRoomAPIUrl.StartOpenSession,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
