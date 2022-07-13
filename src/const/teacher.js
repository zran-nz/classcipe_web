export const ownerMap = {
  'all-owner': undefined,
  'owner-by-me': 1,
  'owner-by-others': 2
}

export const statusMap = {
  'all-status': undefined,
  'draft': 0,
  'published': 1
}

export const CollaborateStatus = {
  'invite': 0,
  'agree': 1,
  'apply': 2,
  'disAgree': -1, // 拒绝邀请
  'refuse': -2 // 申请被拒绝
}

export const typeMap = {
  'all-type': undefined,
  'topic': 1,
  'unit-plan': 2,
  'material': 3,
  'task': 4,
  'lesson': 5,
  'evaluation': 6,
  'classSessionEvaluation': 7,
  'video': 8,
  'pd': 9
}

export function getLabelNameType (type) {
  switch (type) {
    case typeMap.topic:
      return 'Topic'
    case typeMap['unit-plan']:
      return 'Unit Plan'
    case typeMap.material:
      return 'Material'
    case typeMap.task:
      return 'Task'
    case typeMap.lesson:
      return 'Lesson'
    case typeMap.evaluation:
      return 'Assessment tool'
    case typeMap.video:
      return 'Video'
    case typeMap.pd:
      return 'PD content'
  }
}

/**
 * 根据类型获取后台entity 字段直接更新值
 * @param type
 * @returns {string}
 */
export function getEntityType (type) {
  switch (type) {
    case typeMap['unit-plan']:
      return 'TUnitPlan'
    case typeMap.task:
      return 'Task'
    case typeMap.evaluation:
      return 'Evaluation'
    case typeMap.video:
      return 'Content'
    case typeMap.pd:
      return 'Content'
  }
}
