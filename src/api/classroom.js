import request from '@/utils/request'

export const classRoomAPIUrl = {
  queryByClassInfoSlideId: '/classcipe/api/classRoom/queryByClassInfoSlideId'
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
