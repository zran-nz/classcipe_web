import request from '@/utils/request'

const API_PREFIX = 'academic/academicSettingCurriculum'

export const AcademicSettingCurriculum = {
  getCurriculumBySchoolId: `/classcipe/${API_PREFIX}/getBySchoolId`,
  saveCurriculum: `/classcipe/${API_PREFIX}/save`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function saveCurriculum (parameter) {
  return request({
    url: AcademicSettingCurriculum.saveCurriculum,
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
 export function getCurriculumBySchoolId (parameter) {
  return request({
    url: AcademicSettingCurriculum.getCurriculumBySchoolId,
    method: 'get',
    params: parameter
  })
}
