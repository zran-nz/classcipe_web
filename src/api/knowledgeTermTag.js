import request from '@/utils/request'

const API_PREFIX = 'knowledgeTermTag'

export const knowledgeTermTagApi = {
  KnowledgeTermTagAdminCreate: `/classcipe/api/${API_PREFIX}/admin/create`,
  KnowledgeTermTagAdminDelete: `/classcipe/api/${API_PREFIX}/admin/delete`,
  KnowledgeTermTagAdminEdit: `/classcipe/api/${API_PREFIX}/admin/edit`,
  KnowledgeTermTagCommandTermList: `/classcipe/api/${API_PREFIX}/commandTermList`,
  KnowledgeTermTagKnowledgeTagList: `/classcipe/api/${API_PREFIX}/knowledgeTagList`,
  KnowledgeTermTagCustomCreate: `/classcipe/api/${API_PREFIX}/custom/create`,
  KnowledgeTermTagCustomDelete: `/classcipe/api/${API_PREFIX}/custom/delete`,
  KnowledgeTermTagCustomEdit: `/classcipe/api/${API_PREFIX}/custom/edit`,
  KnowledgeTermTagQueryByKeywords: `/classcipe/api/${API_PREFIX}/queryByKeywords`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function KnowledgeTermTagAdminCreate (parameter) {
  return request({
    url: knowledgeTermTagApi.KnowledgeTermTagAdminCreate,
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
export function KnowledgeTermTagAdminDelete (parameter) {
  return request({
    url: knowledgeTermTagApi.KnowledgeTermTagAdminDelete,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function KnowledgeTermTagAdminEdit (parameter) {
  return request({
    url: knowledgeTermTagApi.KnowledgeTermTagAdminEdit,
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
export function KnowledgeTermTagCommandTermList (parameter) {
  return request({
    url: knowledgeTermTagApi.KnowledgeTermTagCommandTermList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function KnowledgeTermTagKnowledgeTagList (parameter) {
  return request({
    url: knowledgeTermTagApi.KnowledgeTermTagKnowledgeTagList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function KnowledgeTermTagCustomCreate (parameter) {
  return request({
    url: knowledgeTermTagApi.KnowledgeTermTagCustomCreate,
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
 export function KnowledgeTermTagQueryByKeywords (parameter) {
  return request({
    url: knowledgeTermTagApi.KnowledgeTermTagQueryByKeywords,
    method: 'get',
    params: parameter
  })
}
