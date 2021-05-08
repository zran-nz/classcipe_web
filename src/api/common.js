import request from '@/utils/request'

export const commonAPIUrl = {
  UploadFile: '/classcipe/common/upload',
  GetSysConfig: '/classcipe/common/getSysConfig'
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
