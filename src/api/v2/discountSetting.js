import request from '@/utils/request'

export const ClassesV2Url = {
  queryByContentId: '/classcipe/api2/discountSetting/queryByContentId',
  save: '/classcipe/api2/discountSetting/save'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function discountSettingQuery (parameter) {
  return request({
    url: ClassesV2Url.queryByContentId,
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
export function discountSettingSave (parameter) {
  return request({
    url: ClassesV2Url.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
