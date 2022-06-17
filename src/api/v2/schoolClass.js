import request from '@/utils/request'

const API_PREFIX = 'api2/school/class'

export const schoolClassApi = {
  addTeachers: `/classcipe/${API_PREFIX}/addTeachers`,
  archiveClass: `/classcipe/${API_PREFIX}/archive`,
  deleteClass: `/classcipe/${API_PREFIX}/delete`,
  deleteGrade: `/classcipe/${API_PREFIX}/grade/delete`,
  listClass: `/classcipe/${API_PREFIX}/list`,
  listByGradeClass: `/classcipe/${API_PREFIX}/listByGrade`,
  listBySubjectClass: `/classcipe/${API_PREFIX}/listBySubject`,
  removeTeachers: `/classcipe/${API_PREFIX}/removeTeachers`,
  restoreClass: `/classcipe/${API_PREFIX}/restore`,
  saveClass: `/classcipe/${API_PREFIX}/save`,
  studentImport: `/classcipe/${API_PREFIX}/student/import`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function addTeachers (parameter) {
  return request({
    url: schoolClassApi.addTeachers,
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
export function archiveClass (parameter) {
  return request({
    url: schoolClassApi.archiveClass,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function deleteClass (parameter) {
  return request({
    url: schoolClassApi.deleteClass,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function deleteGrade (parameter) {
  return request({
    url: schoolClassApi.deleteGrade,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function listClass (parameter) {
  return request({
    url: schoolClassApi.listClass,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function listByGradeClass (parameter) {
  return request({
    url: schoolClassApi.listByGradeClass,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function listBySubjectClass (parameter) {
  return request({
    url: schoolClassApi.listBySubjectClass,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function removeTeachers (parameter) {
  return request({
    url: schoolClassApi.removeTeachers,
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
 export function restoreClass (parameter) {
  return request({
    url: schoolClassApi.restoreClass,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function saveClass (parameter) {
  return request({
    url: schoolClassApi.saveClass,
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
 export function studentImport (parameter) {
  return request({
    url: schoolClassApi.studentImport,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
