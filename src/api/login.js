import request from '@/utils/request'
import plainRequest from '@/utils/plainRequest'
import { trimParams } from '@/utils/util'

const userApi = {
  Login: '/classcipe/sys/login',
  Logout: '/classcipe/sys/logout',
  ChangeRole: '/classcipe/sys/changeRole',
  UserInfo: '/classcipe/sys/getUserInfoByToken',
  SignUp: '/classcipe/sys/signUp',
  ForgePassword: '/classcipe/sys/sendResetPasswordLink',
  ResetPassword: '/classcipe/sys/resetPassword',
  CheckOauthToken: '/classcipe/sys/checkOauthToken',
  CheckPassword: '/classcipe/sys/checkPassword',
  ChangePassword: '/classcipe/sys/changePassword',
  SendVerifyLink: '/classcipe/sys/sendVerifyLink',
  UpdatePersonalInfo: '/classcipe/sys/updatePersonalInfo',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  UserMenu: '/user/nav',
  getPlan: '/classcipe/plan/planInfo/queryMyPlan'
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
  return plainRequest({
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
export function getInfo (token) {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    // params: parameter,
    headers: {
      'X-Access-Token': token,
      'Content-Type': 'application/json;charset=UTF-8'
    }
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
    params: parameter,
    data: parameter
  })
}
export function resetPassword (parameter) {
  return request({
    url: userApi.ResetPassword,
    method: 'post',
    params: parameter,
    data: parameter
  })
}

export function CheckOauthToken (parameter) {
  return request({
    url: userApi.CheckOauthToken,
    method: 'get',
    params: parameter
  })
}

export function CheckPassword (parameter) {
  return request({
    url: userApi.CheckPassword,
    method: 'post',
    params: parameter,
    data: parameter
  })
}

export function ChangePassword (parameter) {
  return request({
    url: userApi.ChangePassword,
    method: 'post',
    data: parameter
  })
}

export function SendVerifyLink (email) {
  return request({
    url: userApi.SendVerifyLink + '?email=' + email,
    method: 'get'
  })
}

export function UpdatePersonalInfo (parameter) {
  // 去除空格
  parameter = trimParams(parameter)
  return request({
    url: userApi.UpdatePersonalInfo,
    method: 'post',
    data: parameter
  })
}

export function getPlan () {
  return request({
    url: userApi.getPlan,
    method: 'get'
  })
}
