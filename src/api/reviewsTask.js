import request from '@/utils/request'

export const reviewsTaskAPIUrl = {
  delete: '/classcipe/api/reviewsTask/delete',
  getMyReviews: '/classcipe/api/reviewsTask/library/getMyReviews',
  getMyReviewsSession: '/classcipe/api/reviewsTask/session/getMyReviews',
  getReviewsStat: '/classcipe/api/reviewsTask/library/getReviewsStat',
  list: '/classcipe/api/reviewsTask/list',
  save: '/classcipe/api/reviewsTask/save',
  getReviewsStatByContentId: '/classcipe/api/reviewsTask/getReviewsStatByContentId'
}

export function ReviewsTaskSave (parameter) {
  return request({
    url: reviewsTaskAPIUrl.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function ReviewsTaskList (parameter) {
  return request({
    url: reviewsTaskAPIUrl.list,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ReviewsTaskMyReview (parameter) {
  return request({
    url: reviewsTaskAPIUrl.getMyReviews,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function ReviewsTaskStats (parameter) {
  return request({
    url: reviewsTaskAPIUrl.getReviewsStat,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ReviewsTaskDelete (parameter) {
  return request({
    url: reviewsTaskAPIUrl.delete + '?id=' + parameter.id,
    method: 'get',
    data: parameter
  })
}

export function ReviewsTaskMyReviewBySession (parameter) {
  return request({
    url: reviewsTaskAPIUrl.getMyReviewsSession,
    method: 'get',
    params: parameter
  })
}

export function getReviewsStatByContentId (parameter) {
  return request({
    url: reviewsTaskAPIUrl.getReviewsStatByContentId,
    method: 'get',
    params: parameter
  })
}
