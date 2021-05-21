import request from '@/utils/request'

export const unitPlanAPIUrl = {
  UnitPlanAddOrUpdate: '/classcipe/api/unitPlan/addOrUpdate',
  UnitPlanQueryById: '/classcipe/api/unitPlan/queryById',
  UnitPlanDelete: '/classcipe/api/unitPlan/delete',
  UnitPlanDeleteBatch: '/classcipe/api/unitPlan/deleteBatch',
  UnitPlanList: '/classcipe/api/unitPlan/list',
  ChangeStatus: '/classcipe/api/unitPlan/status'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function UnitPlanAddOrUpdate (parameter) {
  return request({
    url: unitPlanAPIUrl.UnitPlanAddOrUpdate,
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
export function UnitPlanQueryById (parameter) {
  return request({
    url: unitPlanAPIUrl.UnitPlanQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function UnitPlanDelete (parameter) {
  return request({
    url: unitPlanAPIUrl.UnitPlanDelete,
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
export function UnitPlanDeleteBatch (parameter) {
  return request({
    url: unitPlanAPIUrl.UnitPlanDeleteBatch,
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
export function UnitPlanList (parameter) {
  return request({
    url: unitPlanAPIUrl.UnitPlanList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ChangeStatus (parameter) {
  return request({
    url: unitPlanAPIUrl.ChangeStatus,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
