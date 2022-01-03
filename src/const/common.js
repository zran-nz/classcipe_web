export const SESSION_ACTIVE_KEY = 'classcipe_token_active'
export const SESSION_VIEW_MODE = 'view_mode'
export const SESSION_CURRENT_STATUS = 'currentStatus'
export const SESSION_CURRENT_TYPE = 'currentType'
export const SESSION_CURRENT_PAGE = 'currentPage'
export const SESSION_CURRENT_TYPE_LABEL = 'currentTypeLabel'
export const DICT_TEMPLATE = 'ppt_template'
export const DICT_BLOOM_CATEGORY = 'bloom_categories'
export const DICT_PLAN_RWC = 'rwc'
export const TAG_CATGORY_KEYWORDS = 'Key words'

export const TagType = {
  'knowledge': 1,
  'skill': 2,
  'century': 3,
  'common': 4,
  'idu': 5,
  'ibSkill': 6,
  'bigIdea': 'bigIdea', // 前端自定义类型,后台不存在此类数据
  'assessment': 'assessment' // 前端自定义类型,后台不存在此类数据
}

export const SubjectType = {
  'Learn': 1,
  'Skill': 2,
  'LearnAndSkill': 3
}

export const CurriculumType = {
  AU: 1,
  NZ: 2,
  IGCSE: 7,
  Cambridge: 8,
  IBPYP: 4,
  IBMYP: 5
}

export const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create',
  Extension: 'Extension'
}

export const TemplateType = {
  Learning: 'Learning experience',
  Assessments: 'Assessments',
  Century: '21 century skills'
}

export const CustomTagType = {
  plan: {
    sdg: [TAG_CATGORY_KEYWORDS],
    bigIdea: ['Global Context', 'Key Concepts', 'Relevant Concepts'],
    default: ['Teaching strategies', 'Differentiated instructions'],
    question: ['Knowledge Dimensions']
  },
  task: {
    sa: ['Teaching strategies', 'Differentiated instructions', 'The Arts-Assessment types', 'Science-Assessment types', 'Assessment as Learning', 'Assessment of Learning'],
    fa: ['Bloom\'s Taxonomy', 'Knowledge Dimensions', 'Teaching strategies', 'Differentiated instructions', 'The Arts-Assessment types', 'Science-Assessment types', 'Assessment as Learning', 'Assessment for Learning'],
    activity: ['Teaching strategies', 'Differentiated instructions'],
    base: ['Assessment purpose'],
    default: ['Teaching strategies', 'Differentiated instructions', 'Bloom\'s Taxonomy', 'Knowledge Dimensions']
  }
}
