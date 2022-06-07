import request from '@/utils/request'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'

const API_PREFIX = 'fio'

export const tagsTermsApi = {
  termsPubList: `/${API_PREFIX}/tags-terms/pubList`,
  termsSearch: `/${API_PREFIX}/tags-terms/search`,
  termsCreate: `/${API_PREFIX}/tags-terms`,
  dimensionsPubList: `/${API_PREFIX}/tags-knowledge/pubList`,
  dimensionsSearch: `/${API_PREFIX}/tags-knowledge/search`,
  dimensionsCreate: `/${API_PREFIX}/tags-knowledge`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function termsPubList (parameter) {
  return request({
    url: tagsTermsApi.termsPubList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function termsCreate (parameter) {
  return request({
    url: tagsTermsApi.termsCreate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': storage.get(ACCESS_TOKEN)
    }
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function termsSearch (parameter) {
  return request({
    url: tagsTermsApi.termsSearch,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function dimensionsPubList (parameter) {
  return request({
    url: tagsTermsApi.dimensionsPubList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function dimensionsCreate (parameter) {
  return request({
    url: tagsTermsApi.dimensionsCreate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': storage.get(ACCESS_TOKEN)
    }
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function dimensionsSearch (parameter) {
  return request({
    url: tagsTermsApi.dimensionsSearch,
    method: 'get',
    params: parameter
  })
}
