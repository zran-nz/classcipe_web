import request from '@/utils/request'

export const templateUrl = {
  getTemplates: '/classcipe/api/templates/getTemplates',
  filterTemplates: '/classcipe/api/templates/filterTemplates',
  getPresentation: '/classcipe/api/templates/getPresentation',
  getPublishedPresentation: '/classcipe/api/templates/getPublishedPresentation',
  getPageThumbnail: '/classcipe/api/templates/getPageThumbnail',
  queryById: '/classcipe/api/templates/queryById'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TemplatesGetTemplates (parameter) {
  return request({
    url: templateUrl.getTemplates,
    method: 'get',
    params: parameter
  })
}

export function FilterTemplates (parameter) {
  return request({
    url: templateUrl.filterTemplates,
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
export function TemplatesGetPresentation (parameter) {
  return request({
    url: templateUrl.getPresentation,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TemplatesGetPageThumbnail (parameter) {
  return request({
    url: templateUrl.getPageThumbnail,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TemplatesQueryById (parameter) {
  return request({
    url: templateUrl.queryById,
    method: 'get',
    params: parameter
  })
}

export function TemplatesGetPublishedPresentation (parameter) {
  return request({
    url: templateUrl.getPublishedPresentation,
    method: 'get',
    params: parameter
  })
}
