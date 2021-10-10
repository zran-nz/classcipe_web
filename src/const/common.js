export const SESSION_ACTIVE_KEY = 'classcipe_token_active'
export const SESSION_VIEW_MODE = 'view_mode'
export const SESSION_CURRENT_STATUS = 'currentStatus'
export const SESSION_CURRENT_TYPE = 'currentType'
export const SESSION_CURRENT_PAGE = 'currentPage'
export const SESSION_CURRENT_TYPE_LABEL = 'currentTypeLabel'
export const DICT_TEMPLATE = 'ppt_template'
export const DICT_BLOOM_CATEGORY = 'bloom_categories'

export const TagType = {
  'knowledge': 1,
  'skill': 2,
  'century': 3
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
    sdg: ['Key words'],
    bigIdea: ['Key words', 'Global context', 'Universal Concept'],
    default: ['Teaching strategies', 'Differentiated instructions']
  },
  task: {
    safa: ['The Arts-Assessment types', 'Science-Assessment types'],
    base: ['Assessment purpose'],
    default: ['Teaching strategies', 'Differentiated instructions', 'Bloom Taxonomy', 'Knowledge dimension']
  }
}
