import request from '@/utils/request'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'

export const countryApiUrl = {
  countryCode: '/fio/conf/CountryCodes',
  // getCity: 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
  getCity: '/fio/maps/city/'
}
/**
 * get countryCode
 * @returns {AxiosPromise}
 */
export function getCountry() {
  return request({
    url: countryApiUrl.countryCode,
    method: 'get'
  })
}

// ?input=auck&components=country:nz&key=api_key
// /fio/maps/city/nz?q=au
/**
 * get getCity
 * @returns {AxiosPromise}
 */
 export function getCity(parameter) {
  return request({
    url: countryApiUrl.getCity + parameter.country,
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': storage.get(ACCESS_TOKEN)
    },
    method: 'get'
  })
}