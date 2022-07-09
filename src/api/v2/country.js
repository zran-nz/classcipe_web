import request from '@/utils/request'

export const countryApiUrl = {
  countryCode: '/fio/conf/CountryCodes'
}
/**
 * get sys config
 * @returns {AxiosPromise}
 */
export function getCountry() {
  return request({
    url: countryApiUrl.countryCode,
    method: 'get'
  })
}
