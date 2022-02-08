import request from '@/utils/request'

export const schoolClassStudentAPIUrl = {
  SchoolClassStudentList: '/classcipe/api/school/schoolClassStudent/list',
  SchoolClassStudentAddOrUpdate: '/classcipe/api/school/schoolClassStudent/addOrUpdate',
  SchoolClassStudentDelete: '/classcipe/api/school/schoolClassStudent/delete',
  SchoolClassStudentImportExcel: '/classcipe/api/school/schoolClassStudent/importExcel'
}

export function SchoolClassStudentAddOrUpdate (parameter) {
  return request({
    url: schoolClassStudentAPIUrl.SchoolClassStudentAddOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function SchoolClassStudentDelete (parameter) {
  return request({
    url: schoolClassStudentAPIUrl.SchoolClassStudentDelete + '?id=' + parameter.id,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
