import request from '@/utils/request'

const BASE_PATH = 'reviewsTeacher'

export const reviewsTeacherAPIUrl = {
  delete: `/classcipe/api/${BASE_PATH}/delete`,
  list: `/classcipe/api/${BASE_PATH}/list`,
  save: `/classcipe/api/${BASE_PATH}/save`
}

export function ReviewsTeacherSave (parameter) {
  return request({
    url: reviewsTeacherAPIUrl.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function ReviewsTeacherList (parameter) {
  return request({
    url: reviewsTeacherAPIUrl.list,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ReviewsTeacherDelete (parameter) {
  return request({
    url: reviewsTeacherAPIUrl.delete + '?id=' + parameter.id,
    method: 'get',
    data: parameter
  })
}
