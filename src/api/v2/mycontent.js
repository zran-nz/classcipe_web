import request from '@/utils/request'

export const MyContentV2Url = {
  GetLinkCategory: '/classcipe/api/v2/mycontent/getLinkCategory',
  AddOrUpdateLinkCategory: '/classcipe/api/v2/mycontent/addOrUpdateLinkCategory',
  QueryTagsByIds: '/classcipe/api/v2/mycontent/queryTagsByIds',
  DeleteLinkCategory: '/classcipe/api/v2/mycontent/deleteLinkCategory',
  QueryCustomTags: '/classcipe/api/v2/mycontent/queryCustomTags',
  ImportOtherIdentityContent: '/classcipe/api/v2/mycontent/importOtherIdentityContent',
  UpdateContentField: '/classcipe/api/v2/mycontent/updateContentField',
  ContentBuy: '/classcipe/api/v2/mycontent/content/bye',
  QueryNewBigIdea: '/classcipe/api/v2/mycontent/queryNewBigIdea'
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
export function QueryTagsByIds (parameter) {
  return request({
    url: MyContentV2Url.QueryTagsByIds,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

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
export function QueryCustomTags (parameter) {
  return request({
    url: MyContentV2Url.QueryCustomTags,
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

/**
 * 通用更新表单内容特定字段接口
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function UpdateContentField(parameter) {
  return request({
    url: MyContentV2Url.UpdateContentField,
    method: 'post',
    data: parameter
  })
}

/**
 * 购买buy
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ContentBuy(parameter) {
  return request({
    url: MyContentV2Url.ContentBuy,
    method: 'post',
    data: parameter
  })
}

export function QueryNewBigIdea(parameter) {
  return request({
    url: MyContentV2Url.QueryNewBigIdea,
    method: 'post',
    data: parameter
  })
}
