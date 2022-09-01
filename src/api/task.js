import request from '@/utils/request'

export const taskAPIUrl = {
  createTaskPPT: '/classcipe/api/task/createTaskPPT',
  createNewTaskPPT: '/classcipe/api/task/createNewTaskPPT',
  addOrUpdate: '/classcipe/api/task/addOrUpdate',
  delete: '/classcipe/api/task/delete',
  deleteBatch: '/classcipe/api/task/deleteBatch',
  list: '/classcipe/api/task/list',
  queryById: '/classcipe/api/task/queryById',
  splitTask: '/classcipe/api/task/spliteTask',
  getTaskBySessonId: '/classcipe/api/task/getTaskBySessonId',
  updateSlideEditing: '/classcipe/api/task/updateSlideEditing',
  querySubTask: '/classcipe/api/task/querySubTask'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TaskCreateTaskPPT (parameter) {
  return request({
    url: taskAPIUrl.createTaskPPT,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function TaskCreateNewTaskPPT (parameter) {
  return request({
    url: taskAPIUrl.createNewTaskPPT,
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
export function TaskAddOrUpdate (parameter) {
  return request({
    url: taskAPIUrl.addOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function SplitTask (parameter) {
  return request({
    url: taskAPIUrl.splitTask,
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
export function TaskQueryById (parameter) {
  return request({
    url: taskAPIUrl.queryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function TaskDelete (parameter) {
  return request({
    url: taskAPIUrl.delete + '?id=' + parameter.id,
    method: 'post',
    data: parameter
  })
}

export function getTaskBySessionId (parameter) {
  return request({
    url: taskAPIUrl.getTaskBySessonId,
    method: 'get',
    params: parameter
  })
}

export function UpdateSlideEditing (parameter) {
  return request({
    url: taskAPIUrl.updateSlideEditing,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function QuerySubTask (parameter) {
  return request({
    url: taskAPIUrl.querySubTask,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
