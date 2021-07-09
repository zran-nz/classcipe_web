import request from '@/utils/request'

export const templateUrl = {
  getTemplates: '/classcipe/api/templates/getTemplates',
  getPresentation: '/classcipe/api/templates/getPresentation',
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
