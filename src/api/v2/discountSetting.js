import request from '@/utils/request'

export const DiscountSettingUrl = {
  discountSettingSave: '/classcipe/api2/discountSetting/save',
  QueryByContentId: '/classcipe/api2/discountSetting/queryByContentId'
}

export function DiscountSettingSave (parameter) {
  return request({
    url: DiscountSettingUrl.discountSettingSave,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function DiscountSettingQueryByContentId (parameter) {
  return request({
    url: DiscountSettingUrl.QueryByContentId,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
