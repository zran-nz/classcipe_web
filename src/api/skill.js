import request from '@/utils/request'

export const skillAPIUrl = {
  SkillGetTreeByGradeId: '/classcipe/api/skill/getTreeByGradeId',
  SkillAddOrUpdateTag: '/classcipe/api/skill/addOrUpdateTag',
  SkillQueryTagsBySkillId: '/classcipe/api/skill/queryTagsBySkillId',
  SkillAddOrUpdate: '/classcipe/api/skill/addOrUpdate',
  SkillQueryById: '/classcipe/api/skill/queryById',
  SkillDelete: '/classcipe/api/skill/delete',
  SkillSearch: '/classcipe/api/skill/search',
  SkillDeleteBatch: '/classcipe/api/skill/deleteBatch',
  SkillList: '/classcipe/api/skill/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SkillGetTreeByGradeId (parameter) {
  return request({
    url: skillAPIUrl.SkillGetTreeByGradeId,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SkillAddOrUpdateTag (parameter) {
  return request({
    url: skillAPIUrl.SkillAddOrUpdateTag,
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
export function SkillQueryTagsBySkillId (parameter) {
  return request({
    url: skillAPIUrl.SkillQueryTagsBySkillId,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SkillAddOrUpdate (parameter) {
  return request({
    url: skillAPIUrl.SkillAddOrUpdate,
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
export function SkillQueryById (parameter) {
  return request({
    url: skillAPIUrl.SkillQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SkillDelete (parameter) {
  return request({
    url: skillAPIUrl.SkillDelete,
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
export function SkillDeleteBatch (parameter) {
  return request({
    url: skillAPIUrl.SkillDeleteBatch,
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
export function SkillList (parameter) {
  return request({
    url: skillAPIUrl.SkillList,
    method: 'get',
    params: parameter
  })
}

/**
 * SkillSearch
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function SkillSearch (parameter) {
  return request({
    url: skillAPIUrl.SkillSearch,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
