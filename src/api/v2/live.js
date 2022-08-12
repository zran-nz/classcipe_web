import request from '@/utils/request'

const API_PREFIX = 'live'

export const LiveApiUrl = {
  CreateQRCode: `/classcipe/api/v2/${API_PREFIX}/createQRCode`,
  FindWorkShops: `/classcipe/api/v2/${API_PREFIX}/findWorkShops`,
  SaveRegisteredRecord: `/classcipe/api/v2/${API_PREFIX}/saveRegisteredRecord`,
  CancelRegistered: `/classcipe/api/v2/${API_PREFIX}/cancelRegistered`,
  DetailBySessionId: `/classcipe/api/v2/${API_PREFIX}/detailBySessionId`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FindWorkShops (parameter) {
  return request({
    url: LiveApiUrl.FindWorkShops,
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
export function CreateQRCode (parameter) {
  return request({
    url: LiveApiUrl.CreateQRCode,
    method: 'get',
    responseType: 'blob',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function CancelRegistered (parameter) {
  return request({
    url: LiveApiUrl.CancelRegistered,
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
 export function SaveRegisteredRecord (parameter) {
  return request({
    url: LiveApiUrl.SaveRegisteredRecord,
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
 export function DetailBySessionId (parameter) {
  return request({
    url: LiveApiUrl.DetailBySessionId,
    method: 'get',
    params: parameter
  })
}
