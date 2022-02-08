import request from '@/utils/request'

export const feedbackApiUrl = {
  feedbackSave: '/classcipe/helpme/feedback/save'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FeedbackSave (parameter) {
  return request({
    url: feedbackApiUrl.feedbackSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
