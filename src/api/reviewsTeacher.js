import request from '@/utils/request'

const BASE_PATH = 'reviewsTeacher'

export const reviewsTeacherAPIUrl = {
  delete: `/classcipe/api/${BASE_PATH}/delete`,
  list: `/classcipe/api/${BASE_PATH}/list`,
  save: `/classcipe/api/${BASE_PATH}/save`,
  myReviews: `/classcipe/api/${BASE_PATH}/myReviews`,
  queryReviewsStat: `/classcipe/api/${BASE_PATH}/queryReviewsStat`
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

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function ReviewsTeacherMyReview (parameter) {
  return request({
    url: reviewsTeacherAPIUrl.myReviews,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function ReviewsTeacherStats (parameter) {
  return request({
    url: reviewsTeacherAPIUrl.queryReviewsStat,
    method: 'get',
    params: parameter
  })
}
