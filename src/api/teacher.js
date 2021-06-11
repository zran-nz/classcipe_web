import request from '@/utils/request'
import { typeMap } from '@/const/teacher'
import { TopicDelete } from '@/api/topic'
import { MaterialDelete } from '@/api/material'
import { UnitPlanDelete } from '@/api/unitPlan'
import * as logger from '@/utils/logger'

export const teacherAPIUrl = {
  GetAssociate: '/classcipe/api/teacher/getAssociate',
  GetMyContent: '/classcipe/api/teacher/getMyContent',
  GetMyGrades: '/classcipe/api/teacher/getMyGrades'
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
    'assessment': 6
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
      logger.warn('task delete no yet implement!')
      break
    case typeMap.lesson:
      logger.warn('lesson delete no yet implement!')
      break
    case typeMap.assessment:
      logger.warn('assessment delete no yet implement!')
      break
    default:
      logger.error('wrong delete type ' + MyContentType + ' id: ' + id)
      break
  }
}
