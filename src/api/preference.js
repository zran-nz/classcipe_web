import request from '@/utils/request'

const preferenceApi = {
  GetAllAreas: '/classcipe/api/area/getAllAreas',
  GetAllCurriculums: '/classcipe/api/curriculum/getAllCurriculums',
  GetAllSubjectsByCurriculumId: '/classcipe/api/subject/getAllSubjectsByCurriculumId',
  GetAllSubjectsByParentId: '/classcipe/api/subject/getAllSubjectsByParentId',
  GetAllGrades: '/classcipe/api/grade/getAllGrades',
  GetGradesByCurriculumId: '/classcipe/api/grade/getGradesByCurriculumId',
  AddPreference: '/classcipe/sys/addPreference'
}

export function getAllAreas () {
  return request({
    url: preferenceApi.GetAllAreas,
    method: 'get'
  })
}

export function getAllCurriculums () {
  return request({
    url: preferenceApi.GetAllCurriculums,
    method: 'get'
  })
}

export function getAllSubjectsByCurriculumId (parameter) {
  return request({
    url: preferenceApi.GetAllSubjectsByCurriculumId,
    method: 'get',
    params: parameter
  })
}

export function getAllSubjectsByParentId (parameter) {
  return request({
    url: preferenceApi.GetAllSubjectsByParentId,
    method: 'get',
    params: parameter
  })
}

export function getAllGrades () {
  return request({
    url: preferenceApi.GetAllGrades,
    method: 'get'
  })
}

export function GetGradesByCurriculumId (parameter) {
  return request({
    url: preferenceApi.GetGradesByCurriculumId,
    method: 'get',
    params: parameter
  })
}

export function addPreference (parameter) {
  return request({
    url: preferenceApi.AddPreference,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
