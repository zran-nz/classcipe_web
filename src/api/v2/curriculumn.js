import request from '@/utils/request'

export function GetAuCurriculum () {
  return request({
    url: '/curriculumn/au.json',
    baseURL: '/',
    method: 'get'
  })
}

export function GetNzCurriculum () {
  return request({
    url: '/curriculumn/nz.json',
    baseURL: '/',
    method: 'get'
  })
}
