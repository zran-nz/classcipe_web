import request from '@/utils/request'

export const teacherAPIUrl = {
  GetMyContent: '/classcipe/api/teacher/getMyContent',
  GetMyGrades: '/classcipe/api/teacher/getMyGrades'
}

/**
 * getMyContent
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getMyContent (parameter) {
  return request({
    url: teacherAPIUrl.GetMyContent,
    method: 'get',
    params: parameter
  })
}

/**
 * GetMyGrades
 * @param parameter
 * @returns {AxiosPromise}
 */
export function GetMyGrades () {
  return request({
    url: teacherAPIUrl.GetMyGrades,
    method: 'get'
  })
}
