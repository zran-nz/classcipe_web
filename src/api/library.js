import request from '@/utils/request'

export const libraryURL = {
  Search: '/classcipe/api/library/search',
  QueryContents: '/classcipe/api/library/queryContents'
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
