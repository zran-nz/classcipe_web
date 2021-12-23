import request from '@/utils/request'

export const classRoomAPIUrl = {
  queryByClassInfoSlideId: '/classcipe/api/classRoom/queryByClassInfoSlideId',
  changeClassStatus: '/classcipe/api/classRoom/changeClassStatus',
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
