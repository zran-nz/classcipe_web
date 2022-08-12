import request from '@/utils/request'

export const LibraryV2Url = {
  search: '/classcipe/api/v2/library/search',
  getLibraryRecommend: '/classcipe/api/v2/library/getLibraryRecommend',
  getLibraryResource: '/classcipe/api/v2/library/getLibraryResource',
  queryAllResource: '/classcipe/api/v2/library/queryAllResource',
  queryLibraryResource: '/classcipe/api/v2/library/queryLibraryResource'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function librarySearch (parameter) {
  return request({
    url: LibraryV2Url.search,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function getLibraryRecommend (parameter) {
  return request({
    url: LibraryV2Url.getLibraryRecommend,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function getLibraryResource (parameter) {
  return request({
    url: LibraryV2Url.getLibraryResource,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function queryAllResource (parameter) {
  return request({
    url: LibraryV2Url.queryAllResource,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * edit slide推荐的library和resource内容
 * @param parameter
 * @returns {AxiosPromise}
 */
export function queryLibraryResource (parameter) {
  return request({
    url: LibraryV2Url.queryLibraryResource,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
