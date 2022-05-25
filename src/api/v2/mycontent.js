import request from '@/utils/request'

export const MyContentV2Url = {
  GetLinkCategory: '/classcipe/api/v2/mycontent/getLinkCategory',
  AddOrUpdateLinkCategory: '/classcipe/api/v2/mycontent/addOrUpdateLinkCategory',
  DeleteLinkCategory: '/classcipe/api/v2/mycontent/deleteLinkCategory',
  ImportOtherIdentityContent: '/classcipe/api/v2/mycontent/importOtherIdentityContent'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetLinkCategory (parameter) {
  return request({
    url: MyContentV2Url.GetLinkCategory,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function AddOrUpdateLinkCategory (parameter) {
  return request({
    url: MyContentV2Url.AddOrUpdateLinkCategory,
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
export function DeleteLinkCategory (parameter) {
  return request({
    url: MyContentV2Url.DeleteLinkCategory,
    method: 'post',
    data: parameter,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function ImportOtherIdentityContent(parameter) {
  return request({
    url: MyContentV2Url.ImportOtherIdentityContent,
    method: 'post',
    data: parameter
  })
}
