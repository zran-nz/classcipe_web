import request from '@/utils/request'

const API_PREFIX = 'quotation'

export const quotationApiUrl = {
  QuotationList: `/classcipe/api/school/${API_PREFIX}/list`,
  QuotationGetBySchoolId: `/classcipe/api/school/${API_PREFIX}/getBySchoolId`,
  QuotationAddOrUpdate: `/classcipe/api/school/${API_PREFIX}/addOrUpdate`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function QuotationAddOrUpdate (parameter) {
  return request({
    url: quotationApiUrl.QuotationAddOrUpdate,
    method: 'post',
    data: parameter,
    params: parameter,
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
export function QuotationList (parameter) {
  return request({
    url: quotationApiUrl.QuotationList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function QuotationGetBySchoolId (parameter) {
  return request({
    url: quotationApiUrl.QuotationGetBySchoolId,
    method: 'get',
    params: parameter
  })
}
