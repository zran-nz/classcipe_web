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

export const typeMap = {
  'all-type': undefined,
  'topic': 1,
  'unit-plan': 2,
  'material': 3,
  'task': 4,
  'lesson': 5,
  'evaluation': 6,
  'classSessionEvaluation': 7
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
  }
}
