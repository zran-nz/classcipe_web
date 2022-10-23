import request from '@/utils/request'

export const commonAPIUrl = {
  UploadFile: '/classcipe/common/upload',
  GetSysConfig: '/classcipe/common/getSysConfig',
  GetDictItems: '/classcipe/sys/dict/getDictItems',
  queryTeachers: '/classcipe/sys/sysUserPreference/queryTeachers'
}
/**
 * get sys config
 * @returns {AxiosPromise}
 */
export function getSysConfig () {
  return request({
    url: commonAPIUrl.GetSysConfig,
    method: 'get'
  })
}

export function GetDictItems (code) {
  return request({
    url: commonAPIUrl.GetDictItems + '/' + code,
    method: 'get'
  })
}

export function queryTeachers (params) {
  return request({
    url: commonAPIUrl.queryTeachers,
    params: params,
    method: 'get'
  })
}
