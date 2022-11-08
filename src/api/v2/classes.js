import request from '@/utils/request'

export const ClassesV2Url = {
  findClassSessions: '/classcipe/api/v2/classes/findClassSessions',
  myClassesList: '/classcipe/api/v2/classes/myClassesList',
  findWorkShops: '/classcipe/api/v2/live/findWorkShops',
  addQuickSession: '/classcipe/api/v2/schedule/addQucikSession',
  addSession: '/classcipe/api/v2/schedule/addSession',
  updateSession: '/classcipe/api/v2/schedule/updateSession',
  getClassesStudent: '/classcipe/api/v2/classes/getClassesStudent',
  deleteClass: '/classcipe/api/v2/classes/delete',
  classStatusUpdate: '/classcipe/api/v2/classes/status',
  editSessionSchedule: '/classcipe/api/v2/schedule/editSessionSchedule'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function findClassSessionsV2 (parameter) {
  return request({
    url: ClassesV2Url.findClassSessions,
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
export function myClassesList (parameter) {
  return request({
    url: ClassesV2Url.myClassesList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function findWorkShopsV2 (parameter) {
  return request({
    url: ClassesV2Url.findWorkShops,
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
export function addQuickSessionV2 (parameter) {
  return request({
    url: ClassesV2Url.addQuickSession,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }).then(async rs => {
    if (rs?.result?.[0]?.id) await App.service('session').get(rs.result[0].id)
    return rs
  })
}
/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function AddSessionV2 (parameter) {
  return request({
    url: ClassesV2Url.addSession,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }).then(async rs => {
    if (rs?.result?.[0]?.id) await App.service('session').get(rs.result[0].id)
    return rs
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function UpdateSessionV2 (parameter) {
  return request({
    url: ClassesV2Url.updateSession,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getClassesStudent (parameter) {
  return request({
    url: ClassesV2Url.getClassesStudent,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
 export function DeleteClassV2 (parameter) {
  return request({
    url: ClassesV2Url.deleteClass,
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
 export function EditSessionScheduleV2 (parameter) {
  return request({
    url: ClassesV2Url.editSessionSchedule,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export const isAPPExists = (App) => {
  return App && App.service && typeof App.service === 'function'
}

export async function EndSession (id) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('class2').patch(id, {
      status: 'close'
    })
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}

export async function ReopenSession (id) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('class2').patch(id, {
      status: 'live'
    })
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}

export async function ArchiveSession (id) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('class2').patch(id, {
      del_flag: 1
    })
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}

export async function RestoreSession (id) {
  const App = window.App || {}
  if (isAPPExists(App)) {
    const result = await App.service('class2').patch(id, {
      del_flag: 0
    })
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('No APP imported'))
  }
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function ClassStatusUpdate (parameter) {
  return request({
    url: ClassesV2Url.classStatusUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
