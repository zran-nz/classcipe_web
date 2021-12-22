import request from '@/utils/request'

export const classRoomAPIUrl = {
  queryByClassInfoSlideId: '/classcipe/api/classRoom/queryByClassInfoSlideId',
  changeClassStatus: '/classcipe/api/classRoom/changeClassStatus'
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
