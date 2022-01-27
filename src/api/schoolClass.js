import request from '@/utils/request'

export const schoolClassAPIUrl = {
  SchoolClassAddClassMember: '/classcipe/api/school/class/addClassMember',
  SchoolClassAddOrUpdate: '/classcipe/api/school/class/addOrUpdate',
  PersonalAddOrUpdateClass: '/classcipe/api/school/class/addOrUpdatePersonalClass',
  FindClassBySessonId: '/classcipe/api/school/class/findClassBySessonId',
  SchoolClassGetById: '/classcipe/api/school/class/getById',
  SchoolClassGetMyClasses: '/classcipe/api/school/class/getMyClasses',
  SchoolClassClassList: '/classcipe/api/school/class/list',
  SchoolClassListClassMembers: '/classcipe/api/school/class/listClassMembers',
  SchoolClassDelete: '/classcipe/api/school/class/delete',
  SchoolClassRemoveClassMember: '/classcipe/api/school/class/removeClassMember',
  SchoolClassImport: '/classcipe/api/school/class/import'
}

export function SchoolClassAddClassMember (parameter) {
  return request({
    url: schoolClassAPIUrl.SchoolClassAddClassMember,
    method: 'get',
    data: parameter
  })
}

export function SchoolClassAddOrUpdate (parameter) {
  return request({
    url: schoolClassAPIUrl.SchoolClassAddOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function PersonalAddOrUpdateClass (parameter) {
  return request({
    url: schoolClassAPIUrl.PersonalAddOrUpdateClass,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function FindClassBySessonId (parameter) {
  return request({
    url: schoolClassAPIUrl.FindClassBySessonId,
    method: 'get',
    data: parameter
  })
}

export function SchoolClassGetById (parameter) {
  return request({
    url: schoolClassAPIUrl.SchoolClassGetById,
    method: 'get',
    data: parameter
  })
}

export function SchoolClassGetMyClasses () {
  return request({
    url: schoolClassAPIUrl.SchoolClassGetMyClasses,
    method: 'get'
  })
}

export function SchoolClassClassList () {
  return request({
    url: schoolClassAPIUrl.SchoolClassClassList,
    method: 'get'
  })
}

export function SchoolClassListClassMembers () {
  return request({
    url: schoolClassAPIUrl.SchoolClassListClassMembers,
    method: 'get'
  })
}

export function SchoolClassRemoveClassMember () {
  return request({
    url: schoolClassAPIUrl.SchoolClassRemoveClassMember,
    method: 'get'
  })
}
