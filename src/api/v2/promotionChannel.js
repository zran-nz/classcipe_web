import request from '@/utils/request'

const API_PREFIX = 'promotionChannel'

export const PromotionChannelApi = {
  addPvCount: `/classcipe/api/${API_PREFIX}/addPvCount`,
  addRegisterCount: `/classcipe/api/${API_PREFIX}/addRegisterCount`,
  addParticipateCount: `/classcipe/api/${API_PREFIX}/addParticipateCount`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function addPvCount (parameter) {
  return request({
    url: PromotionChannelApi.addPvCount,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function addRegisterCount (parameter) {
  return request({
    url: PromotionChannelApi.addRegisterCount,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function addParticipateCount (parameter) {
  return request({
    url: PromotionChannelApi.addParticipateCount,
    method: 'get',
    params: parameter
  })
}
