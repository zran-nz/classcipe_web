import request from '@/utils/request'

export const knowledgeAPIUrl = {
  KnowledgeGetTree: '/classcipe/api/knowledge/getTree',
  KnowledgeAddOrUpdate: '/classcipe/api/knowledge/addOrUpdate',
  KnowledgeQueryById: '/classcipe/api/knowledge/queryById',
  KnowledgeDelete: '/classcipe/api/knowledge/delete',
  KnowledgeDeleteBatch: '/classcipe/api/knowledge/deleteBatch',
  KnowledgeList: '/classcipe/api/knowledge/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function KnowledgeGetTree (parameter) {
  return request({
    url: knowledgeAPIUrl.KnowledgeGetTree,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function KnowledgeAddOrUpdate (parameter) {
  return request({
    url: knowledgeAPIUrl.KnowledgeAddOrUpdate,
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
export function KnowledgeQueryById (parameter) {
  return request({
    url: knowledgeAPIUrl.KnowledgeQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function KnowledgeDelete (parameter) {
  return request({
    url: knowledgeAPIUrl.KnowledgeDelete,
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
export function KnowledgeDeleteBatch (parameter) {
  return request({
    url: knowledgeAPIUrl.KnowledgeDeleteBatch,
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
export function KnowledgeList (parameter) {
  return request({
    url: knowledgeAPIUrl.KnowledgeList,
    method: 'get',
    params: parameter
  })
}
