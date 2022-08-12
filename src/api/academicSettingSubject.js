import request from '@/utils/request'

const API_PREFIX = 'academic/academicSettingSubject'

export const AcademicSettingSubject = {
  getSubjectBySchoolId: `/classcipe/${API_PREFIX}/getBySchoolId`,
  saveSubject: `/classcipe/${API_PREFIX}/save`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function saveSubject (parameter) {
  return request({
    url: AcademicSettingSubject.saveSubject,
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
 export function getSubjectBySchoolId (parameter) {
  return request({
    url: AcademicSettingSubject.getSubjectBySchoolId,
    method: 'get',
    params: parameter
  })
}
