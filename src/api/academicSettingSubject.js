import request from '@/utils/request'

const API_PREFIX = 'academic/academicSettingSubject'

export const AcademicSettingSubject = {
  getBySchoolId: `/classcipe/${API_PREFIX}/getBySchoolId`,
  saveSubject: `/classcipe/${API_PREFIX}/save`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function saveCurriculum (parameter) {
  return request({
    url: AcademicSettingSubject.saveCurriculum,
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
 export function getBySchoolId (parameter) {
  return request({
    url: AcademicSettingSubject.getBySchoolId,
    method: 'get',
    params: parameter
  })
}
