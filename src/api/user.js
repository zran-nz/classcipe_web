import request from '@/utils/request'

export const userAPIUrl = {
  EditUser: '/classcipe/sys/user/edit'
}

/**
 *
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function editUser (parameter) {
  return request({
    url: userAPIUrl.EditUser,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
