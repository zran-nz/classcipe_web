import request from '@/utils/request'

const API_PREFIX = 'academic/academicTermInfo'

export const AcademicTermInfo = {
  addTerm: `/classcipe/${API_PREFIX}/addTerm`,
  addYear: `/classcipe/${API_PREFIX}/addYear`,
  deleteTerm: `/classcipe/${API_PREFIX}/deleteTerm`,
  deleteYear: `/classcipe/${API_PREFIX}/deleteYear`,
  editTerm: `/classcipe/${API_PREFIX}/editTerm`,
  editYear: `/classcipe/${API_PREFIX}/editYear`,
  saveBlockSetting: `/classcipe/${API_PREFIX}/saveBlockSetting`,
  termList: `/classcipe/${API_PREFIX}/termList`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function addTerm (parameter) {
  return request({
    url: AcademicTermInfo.addTerm,
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
export function deleteTerm (parameter) {
  return request({
    url: AcademicTermInfo.deleteTerm,
    method: 'delete',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function deleteYear (parameter) {
  return request({
    url: AcademicTermInfo.deleteYear,
    method: 'delete',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function addYear (parameter) {
  return request({
    url: AcademicTermInfo.addYear,
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
 export function editTerm (parameter) {
  return request({
    url: AcademicTermInfo.editTerm,
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
 export function editYear (parameter) {
  return request({
    url: AcademicTermInfo.editYear,
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
 export function saveBlockSetting (parameter) {
  return request({
    url: AcademicTermInfo.saveBlockSetting,
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
 export function termList (parameter) {
  return request({
    url: AcademicTermInfo.termList,
    method: 'get',
    params: parameter
  })
}
