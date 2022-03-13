export const SESSION_ACTIVE_KEY = 'classcipe_token_active'
export const SESSION_VIEW_MODE = 'view_mode'
export const SESSION_CURRENT_STATUS = 'currentStatus'
export const SESSION_CURRENT_TYPE = 'currentType'
export const SESSION_CURRENT_PAGE = 'currentPage'
export const SESSION_CURRENT_TYPE_LABEL = 'currentTypeLabel'
export const DICT_TEMPLATE = 'ppt_template'
export const DICT_BLOOM_CATEGORY = 'bloom_categories'
export const DICT_PROMPT_PURPOSE = 'prompt_purpose'
export const DICT_PROMPT_TYPE = 'prompt_type'
export const DICT_BLOOM_TAXONOMY = 'bloom_taxonomy'
export const DICT_ORDER_TYPE = 'order_type'
export const DICT_ORDER_STATUS = 'order_status'
export const TAG_CATGORY_KEYWORDS = 'Key words'
export const SESSION_CALLBACK_URL = 'classcipe_callback_url'

export const TagType = {
  'knowledge': 1,
  'skill': 2,
  'century': 3,
  'common': 4,
  'idu': 5,
  'ibSkill': 6,
  'bigIdea': 7,
  'assessment': 8
}

export const ClassType = {
  'school': 1,
  'personal': 2,
  'openSession': 3
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

export const PlanField = {
  Name: 'name',
  ProjectBased: 'projectBased',
  UnitType: 'unitType',
  GradeId: 'gradeId',
  StartDate: 'startDate',
  Inquiry: 'inquiry',
  Sdg: 'sdg',
  Scenarios: 'scenarios',
  Rwc: 'rwc',
  Question: 'question',
  Assessment: 'assessment',
  LearnOuts: 'learnOuts',
  Prior: 'prior',
  Link: 'link'
}
export const PlanFieldDisplayName = {
  name: 'Unit plan',
  projectBased: 'Project-based Unit',
  unitType: 'Unit type',
  startDate: 'Start Date',
  inquiry: 'Big Idea/ Statement of Inquiry/ Central Idea',
  sdg: 'UN Sustainable Development Goal',
  rwc: 'Real World Connection(',
  question: 'Key question(s) / Line(s) of inquiry',
  assessment: 'Set learning objectives',
  prior: 'Prior learning experience',
  link: 'Link Plan content'
}

export const TaskField = {
  Name: 'name',
  TaskClassList: 'taskClassList',
  TaskType: 'taskType',
  StartDate: 'startDate',
  Overview: 'overview',
  Sdg: 'sdg',
  Rwc: 'rwc',
  Question: 'question',
  Assessment: 'assessment',
  LearnOuts: 'learnOuts',
  MaterialList: 'materialList',
  Link: 'link'
}

export const TaskFieldDisplayName = {
  name: 'Task name',
  taskType: 'Choose Task Type',
  startDate: 'Start Date',
  overview: 'Task details',
  question: 'Choose Key questions',
  assessment: 'Choose Key questions',
  materialList: 'Material list',
  link: 'Link relevant content'
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
    rwc: ['Global Context'],
    bigIdea: ['Global Context', 'Key Concepts', 'Relevant Concepts'],
    default: ['Teaching strategies', 'Differentiated instructions'],
    question: ['Knowledge Dimensions']
  },
  task: {
    sa: ['Teaching strategies', 'Differentiated instructions', 'Assessment types', 'Assessment as Learning', 'Assessment of Learning'],
    fa: ['Bloom\'s Taxonomy', 'Knowledge Dimensions', 'Teaching strategies', 'Differentiated instructions', 'Assessment types', 'Assessment as Learning', 'Assessment for Learning'],
    activity: ['Teaching strategies', 'Differentiated instructions'],
    base: ['Assessment purpose'],
    default: ['Teaching strategies', 'Differentiated instructions', 'Bloom\'s Taxonomy', 'Knowledge Dimensions']
  }
}

export const StudentStudyTaskStatus = [
  {
    value: 3,
    title: 'Scheduled'
  },
  {
    value: 0,
    title: 'On-going'
  },
  {
    value: 1,
    title: 'Completed'
  },
  {
    value: 2,
    title: 'Archived'
  }
]

export const OrderType = {
  Tasks: '1',
  AskTeacher: '2',
  Other: '9'
}

/**
 * 0: {id: "1", name: "AU curriculum", country: "AU", delFlag: 0, createBy: null, createTime: null,…}
 1: {id: "2", name: "NZ-National", country: "NZ", delFlag: 0, createBy: null, createTime: null,…}
 2: {id: "4", name: "IB-PYP", country: "IB", delFlag: 0, createBy: null, createTime: null,…}
 3: {id: "5", name: "IB-MYP", country: "IB", delFlag: 0, createBy: "", createTime: "2021-05-12 17:13:34",…}
 4: {id: "7", name: "IGCSE", country: "IGCSE", delFlag: 0, createBy: null, createTime: null,…}
 5: {id: "8", name: "Cambridge", country: "International", delFlag: 0, createBy: "admin",…}
 * @type
 */
export const AllCurriculums = {
  AU: '1',
  NZ: '2',
  IGCSE: '7',
  Cambridge: '8',
  IBPYP: '4',
  IBMYP: '5'
}

export const STUDY_MODE = {
  SELF: 'selfStudy',
  SCHOOL: 'schoolStudy'
}

export const TASK_STATUS = {
  SCHEDULED: 3,
  ONGOING: 0,
  COMPLETED: 1,
  ARCHIVED: 2
}

export const BG_COLORS = ['#f03132', '#0072bb', '#91191a', '#4d91f9', '#002056', '#f68e54', '#329933', '#3333cc']

export const ABSENT_COLORS = ['#faad3c', '#1aaf5c', '#849bbb']

export const TODO_STATUS = {
  TODO: 1,
  DONE: 2
}

export const TASK_ATTENDANCE = {
  PRESENT: 'present',
  ABSENT: 'absent'
}
