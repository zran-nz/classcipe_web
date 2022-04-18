import request from '@/utils/request'

const API_PREFIX = 'schoolAcademic'

export const schoolAcademic = {
  AddAcademic: `/classcipe/school/${API_PREFIX}/addAcademic`,
  DeleteAcademicYearById: `/classcipe/school/${API_PREFIX}/deleteAcademicYearById`,
  EditAcademic: `/classcipe/school/${API_PREFIX}/editAcademic`,
  QueryAcademic: `/classcipe/school/${API_PREFIX}/queryAcademic`,
  QueryAcademicById: `/classcipe/school/${API_PREFIX}/queryAcademicById`,
  GetSchoolCurriculum: `/classcipe/school/${API_PREFIX}/getSchoolCurriculum`,
  GetSchoolGrade: `/classcipe/school/${API_PREFIX}/getSchoolGrade`,
  GetSchoolSubject: `/classcipe/school/${API_PREFIX}/getSchoolSubject`,
  SaveSchoolCurriculum: `/classcipe/school/${API_PREFIX}/saveSchoolCurriculum`,
  SaveSchoolGrade: `/classcipe/school/${API_PREFIX}/saveSchoolGrade`,
  SaveSchoolSubject: `/classcipe/school/${API_PREFIX}/saveSchoolSubject`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function AddAcademic (parameter) {
  return request({
    url: schoolAcademic.AddAcademic,
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
export function DeleteAcademicYearById (parameter) {
  return request({
    url: schoolAcademic.DeleteAcademicYearById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function EditAcademic (parameter) {
  return request({
    url: schoolAcademic.EditAcademic,
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
 export function QueryAcademic (parameter) {
  return request({
    url: schoolAcademic.QueryAcademic,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function QueryAcademicById (parameter) {
  return request({
    url: schoolAcademic.QueryAcademicById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function GetSchoolCurriculum (parameter) {
  return request({
    url: schoolAcademic.GetSchoolCurriculum,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function GetSchoolGrade (parameter) {
  return request({
    url: schoolAcademic.GetSchoolGrade,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function GetSchoolSubject (parameter) {
  return request({
    url: schoolAcademic.GetSchoolSubject,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function SaveSchoolCurriculum (parameter) {
  return request({
    url: schoolAcademic.SaveSchoolCurriculum,
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
 export function SaveSchoolGrade (parameter) {
  return request({
    url: schoolAcademic.SaveSchoolGrade,
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
 export function SaveSchoolSubject (parameter) {
  return request({
    url: schoolAcademic.SaveSchoolSubject,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
