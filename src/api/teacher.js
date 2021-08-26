import request from '@/utils/request'
import { typeMap } from '@/const/teacher'
import { TopicDelete } from '@/api/topic'
import { MaterialDelete } from '@/api/material'
import { UnitPlanDelete } from '@/api/unitPlan'
import { TaskDelete } from '@/api/task'
import * as logger from '@/utils/logger'
import { EvaluationDelete } from '@/api/evaluation'
import { LessonDelete } from '@/api/myLesson'

export const teacherAPIUrl = {
  Associate: '/classcipe/api/teacher/associate',
  AssociateCancel: '/classcipe/api/teacher/associateCancel',
  BatchAssociate: '/classcipe/api/teacher/batchAssociate',
  GetAssociate: '/classcipe/api/teacher/getAssociate',
  GetMyContent: '/classcipe/api/teacher/getMyContent',
  FindMyContent: '/classcipe/api/teacher/findMyContent',
  GetMyGrades: '/classcipe/api/teacher/getMyGrades',
  UpdateContentStatus: '/classcipe/api/teacher/content/status',
  saveSessonTags: '/classcipe/api/sessonTags/addBatch'
}

/**
 * GetAssociate
 * @param parameter
 * @returns {AxiosPromise}
 */
export function GetAssociate (parameter) {
  return request({
    url: teacherAPIUrl.GetAssociate,
    method: 'get',
    params: parameter
  })
}

/**
 * getMyContent
 * @param parameter
 * @returns {AxiosPromise}
 */
export function getMyContent (parameter) {
  return request({
    url: teacherAPIUrl.GetMyContent,
    method: 'get',
    params: parameter
  })
}

/**
 * types
 * @param parameter
 * @returns {AxiosPromise}
 */
export function FindMyContent (parameter) {
  return request({
    url: teacherAPIUrl.FindMyContent,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * GetMyGrades
 * @param parameter
 * @returns {AxiosPromise}
 */
export function GetMyGrades () {
  return request({
    url: teacherAPIUrl.GetMyGrades,
    method: 'get'
  })
}

/**
 * My Content Delete By Type
 *  'topic': 1,
    'unit-plan': 2,
    'material': 3,
    'task': 4,
    'lesson': 5,
    'evaluation': 6
 * @param data
 * @constructor
 */
export function deleteMyContentByType (data) {
  const MyContentType = data.type
  const id = data.id
  switch (MyContentType) {
    case typeMap.topic:
      return TopicDelete({ id })
    case typeMap['unit-plan']:
      return UnitPlanDelete({ id })
    case typeMap.material:
      return MaterialDelete({ id })
    case typeMap.task:
      return TaskDelete({ id })
    case typeMap.lesson:
      return LessonDelete({ id })
    case typeMap.evaluation:
      return EvaluationDelete({ id })
    default:
      logger.error('wrong delete type ' + MyContentType + ' id: ' + id)
      break
  }
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function UpdateContentStatus (parameter) {
  return request({
    url: teacherAPIUrl.UpdateContentStatus,
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
export function Associate (parameter) {
  return request({
    url: teacherAPIUrl.Associate,
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
export function AssociateCancel (parameter) {
  return request({
    url: teacherAPIUrl.AssociateCancel,
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
export function BatchAssociate (parameter) {
  return request({
    url: teacherAPIUrl.BatchAssociate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function SaveSessonTags (parameter) {
  return request({
    url: teacherAPIUrl.saveSessonTags,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
