import request from '@/utils/request'

export const classRoomAPIUrl = {
  queryByClassInfoSlideId: '/classcipe/api/classRoom/queryByClassInfoSlideId',
  changeClassStatus: '/classcipe/api/classRoom/changeClassStatus',
  queryCommentsByClassId: '/classcipe/api/classRoom/queryCommentsByClassId',
  queryPresentationCommentsByClassId: '/classcipe/api/classRoom/queryPresentationCommentsByClassId',
  queryResponseByClassId: '/classcipe/api/classRoom/queryResponseByClassId',
  addOrUpdateClass: '/classcipe/api/classRoom/addOrUpdateClass'
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
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
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
    params: parameter
  })
}

export function QueryResponseByClassId (parameter) {
  return request({
    url: classRoomAPIUrl.queryResponseByClassId,
    method: 'get',
    params: parameter
  })
}
