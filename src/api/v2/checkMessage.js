import request from '@/utils/request'

const API_PREFIX = 'api2/school/user'

export const schoolUserApi = {
  isSchoolTeacher: `/classcipe/${API_PREFIX}/isSchoolTeacher`
}

export function checkIsSchoolTeacher(parameter) {
  return request({
    url: schoolUserApi.isSchoolTeacher,
    method: 'get',
    params: parameter
  }).catch(err => {
    return Promise.reject(err)
  })
}
