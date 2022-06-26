import request from '@/utils/request'

const API_PREFIX = 'api2/school/user'

export const schoolUserApi = {
  getSchoolUsers: `/classcipe/${API_PREFIX}/getSchoolUsers`,
  addStudents: `/classcipe/${API_PREFIX}/addStudents`,
  addTeacher: `/classcipe/${API_PREFIX}/addTeacher`,
  removeStudents: `/classcipe/${API_PREFIX}/removeStudents`,
  removeTeachers: `/classcipe/${API_PREFIX}/removeTeachers`,
  updateTeacher: `/classcipe/${API_PREFIX}/updateTeacher`,
  getInvite: `/classcipe/${API_PREFIX}/getInvite`,
  bulkActTeacher: `/classcipe/${API_PREFIX}/teacher/bulkAct`,
  bulkActStudent: `/classcipe/${API_PREFIX}/student/bulkAct`,
  acceptInvite: `/classcipe/${API_PREFIX}/acceptInvite`,
  batchAddStudent: `/classcipe/${API_PREFIX}/batchAddStudent`,
  batchAddTeacher: `/classcipe/${API_PREFIX}/batchAddTeacher`,
  getStudentInfo: `/classcipe/${API_PREFIX}/getStudentInfo`,
  checkEmailParent: `/classcipe/${API_PREFIX}/parent/checkEmail`,
  resetPassword: `/classcipe/${API_PREFIX}/resetPassword`,
  checkEmailStudent: `/classcipe/${API_PREFIX}/student/checkEmail`,
  moveClassStudent: `/classcipe/${API_PREFIX}/student/moveClass`,
  sendParentEmail: `/classcipe/${API_PREFIX}/student/sendParentEmail`,
  checkEmailTeacher: `/classcipe/${API_PREFIX}/teacher/checkEmail`,
  updateStudent: `/classcipe/${API_PREFIX}/updateStudent`
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
 export function getInvite (parameter) {
  return request({
    url: schoolUserApi.getInvite,
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
 export function updateTeacher (parameter) {
  return request({
    url: schoolUserApi.updateTeacher,
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
 export function bulkActTeacher (parameter) {
  return request({
    url: schoolUserApi.bulkActTeacher,
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
 export function bulkActStudent (parameter) {
  return request({
    url: schoolUserApi.bulkActStudent,
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
 export function acceptInvite (parameter) {
  return request({
    url: schoolUserApi.acceptInvite,
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
 export function batchAddStudent (parameter) {
  return request({
    url: schoolUserApi.batchAddStudent,
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
 export function batchAddTeacher (parameter) {
  return request({
    url: schoolUserApi.batchAddTeacher,
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
 export function getStudentInfo (parameter) {
  return request({
    url: schoolUserApi.getStudentInfo,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function checkEmailParent (parameter) {
  return request({
    url: schoolUserApi.checkEmailParent,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function checkEmailStudent (parameter) {
  return request({
    url: schoolUserApi.checkEmailStudent,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function checkEmailTeacher (parameter) {
  return request({
    url: schoolUserApi.checkEmailTeacher,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function resetPassword (parameter) {
  return request({
    url: schoolUserApi.resetPassword,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function moveClassStudent (parameter) {
  return request({
    url: schoolUserApi.moveClassStudent,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function updateStudent (parameter) {
  return request({
    url: schoolUserApi.updateStudent,
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
 export function sendParentEmail (parameter) {
  return request({
    url: schoolUserApi.sendParentEmail,
    method: 'get',
    params: parameter
  })
}
