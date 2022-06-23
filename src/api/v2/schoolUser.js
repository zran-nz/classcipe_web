import request from '@/utils/request'

const API_PREFIX = 'api2/school/user'

export const schoolUserApi = {
  getSchoolUsers: `/classcipe/${API_PREFIX}/getSchoolUsers`,
  addStudents: `/classcipe/${API_PREFIX}/addStudents`,
  addTeacher: `/classcipe/${API_PREFIX}/addTeacher`,
  removeStudents: `/classcipe/${API_PREFIX}/removeStudents`,
  removeTeachers: `/classcipe/${API_PREFIX}/removeTeachers`,
  updateStudentStatus: `/classcipe/${API_PREFIX}/updateStudentStatus`,
  updateTeacherStatus: `/classcipe/${API_PREFIX}/updateTeacherStatus`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function getSchoolUsers (parameter) {
  return request({
    url: schoolUserApi.getSchoolUsers,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function addStudents (parameter) {
  return request({
    url: schoolUserApi.addStudents,
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
 export function addTeacher (parameter) {
  return request({
    url: schoolUserApi.addTeacher,
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
 export function removeStudents (parameter) {
  return request({
    url: schoolUserApi.removeStudents,
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
 export function removeTeachers (parameter) {
  return request({
    url: schoolUserApi.removeTeachers,
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
 export function updateStudentStatus (parameter) {
  return request({
    url: schoolUserApi.updateStudentStatus,
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
 export function updateTeacherStatus (parameter) {
  return request({
    url: schoolUserApi.updateTeacherStatus,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
