import request from '@/utils/request'

export const libraryURL = {
  Search: '/classcipe/api/library/search',
  QueryContents: '/classcipe/api/library/queryContents',
  QueryKeyContents: '/classcipe/api/library/queryKeyContents',
  queryContentsFilter: '/classcipe/api/library/queryContentsFilter'
}

export function Search (parameter) {
  return request({
    url: libraryURL.Search,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function QueryContents (parameter) {
  return request({
    url: libraryURL.QueryContents,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function QueryKeyContents (parameter) {
  return request({
    url: libraryURL.QueryKeyContents,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function QueryContentsFilter (parameter) {
  return request({
    url: libraryURL.queryContentsFilter,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
