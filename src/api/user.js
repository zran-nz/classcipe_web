import request from '@/utils/request'

export const userAPIUrl = {
  EditUser: '/classcipe/sys/user/edit',
  SearchUser: '/classcipe/sys/user/queryUserByName',
  AddUserCollaborate: '/classcipe/sys/user/Collaborate'
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

export function AddUserCollaborate (parameter) {
  return request({
    url: userAPIUrl.AddUserCollaborate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
