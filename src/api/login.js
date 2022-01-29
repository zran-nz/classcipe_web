import request from '@/utils/request'

const userApi = {
  Login: '/classcipe/sys/login',
  Logout: '/classcipe/sys/logout',
  ChangeRole: '/classcipe/sys/changeRole',
  UserInfo: '/classcipe/sys/getUserInfoByToken',
  SignUp: '/classcipe/sys/signUp',
  ForgePassword: '/classcipe/sys/sendResetPasswordLink',
  ResetPassword: '/classcipe/sys/resetPassword',

  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  UserMenu: '/user/nav'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function signUp (parameter) {
  return request({
    url: userApi.SignUp,
    method: 'post',
    data: parameter
  })
}

/**
 * parameter: {
 *   token: ''
 * }
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getInfo (parameter) {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    params: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'get'
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}

/**
 * changeRole
 * @param parameter
 * @returns {AxiosPromise}
 */
export function changeRole (parameter) {
  return request({
    url: userApi.ChangeRole,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function forgePassword (parameter) {
  return request({
    url: userApi.ForgePassword,
    method: 'post',
    params: parameter
  })
}
export function resetPassword (parameter) {
  return request({
    url: userApi.ResetPassword,
    method: 'post',
    params: parameter
  })
}
