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
export const DICT_KNOWLEDGE_PHASE = 'knowledge_phase'
export const DICT_KNOWLEDGE_DIMENSION = 'knowledge_dimension'
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
  Overview: 'overview',
  ProjectBased: 'projectBased',
  UnitType: 'unitType',
  SubjectIds: 'subjectIds',
  GradeIds: 'gradeIds',
  StartDate: 'startDate',
  Inquiry: 'inquiry',
  Sdg: 'sdg',
  Scenarios: 'scenarios',
  Rwc: 'rwc',
  Question: 'questions',
  Assessment: 'assessment',
  LearnOuts: 'learnOuts',
  Prior: 'prior',
  Link: 'link',
  Image: 'image',
  CoverVideo: 'coverVideo'
}
export const PlanFieldDisplayName = {
  name: 'Unit plan',
  overview: 'Overview',
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
  SubjectIds: 'subjectIds',
  GradeIds: 'gradeIds',
  Question: 'question',
  AssessmentTools: 'assessmentTools',
  LearnOuts: 'learnOuts',
  MaterialList: 'materialList',
  Link: 'link',
  Slides: 'taskSlides',
  Image: 'image',
  CoverVideo: 'coverVideo'
}

export const SplitTaskField = {
  Name: 'name',
  TaskType: 'taskType',
  StartDate: 'startDate',
  Overview: 'overview',
  Sdg: 'sdg',
  Rwc: 'rwc',
  SubjectIds: 'subjectIds',
  GradeIds: 'gradeIds',
  Question: 'question',
  AssessmentTools: 'assessmentTools',
  LearnOuts: 'learnOuts',
  MaterialList: 'materialList',
  Link: 'link',
  Slides: 'taskSlides',
  SelectSlides: 'selectSlides',
  Image: 'image',
  CoverVideo: 'coverVideo'
}

export const PdField = {
  Name: 'name',
  Image: 'image',
  CoverVideo: 'coverVideo',
  Goals: 'goals',
  Slides: 'slides',
  Link: 'link',
  VideoList: 'VideoList'
}

export const VideoField = {
  Name: 'name',
  Goals: 'goals',
  ContentType: 'contentType',
  Image: 'image',
  Video: 'video',
  VideoType: 'videoType',
  CoverImage: 'image',
  CoverVideo: 'coverVideo',
  CustomTags: 'customTags',
  LearnOuts: 'learnOuts',
  SubjectIds: 'subjectIds',
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
  Century: '21 century skills',
  Prompt: 'prompt'
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

export const USER_MODE = {
  SELF: 'self',
  SCHOOL: 'school'
}

export const TASK_STATUS = {
  SCHEDULED: 3,
  ONGOING: 0,
  COMPLETED: 1,
  ARCHIVED: 2
}

export const BG_COLORS = ['#CDE7FF', '#F7E3FF', '#BAEAD0', '#FCF2BD', '#FDD7DE', '#BCDCF7']

export const ABSENT_COLORS = ['#faad3c', '#1aaf5c', '#849bbb']

export const TODO_STATUS = {
  TODO: 1,
  DONE: 2
}

export const TASK_ATTENDANCE = {
  PRESENT: 'present',
  ABSENT: 'absent'
}

export const RATE_TOOLTIPS = {
  OVERALL: ['Not recommended', 'Poor', 'Average', 'Good', 'Excellent'],
  ENGAGEMENT: ['Rebellion', 'Retreatism', 'Ritual Compliance', 'Strategic Compliance', 'Authentic Engagement'],
  EFFETIVENESS: ['Very Ineffective', 'Ineffective', 'Effective Enough', 'Effective', 'Very Effective'],
  QUALITY: ['Inadequate', 'Capable', 'Satisfactory', 'Excellent', 'Super']
}

export const STATISTICS_TYPE = {
  EARNINGS: {
    label: 'Earnings',
    value: 1
  },
  CONVERSIONS: {
    label: 'Conversions',
    value: 2
  },
  PREVIEWS: {
    label: 'Previews',
    value: 3
  },
  UNITSSOLD: {
    label: 'Units sold',
    value: 4
  },
  TASKSOLD: {
    label: 'Tasks sold',
    value: 5
  },
  ASSESSMENTSOLD: {
    label: 'Assessments sold',
    value: 6
  }
}

export const COLOR_LEVEL = {
  BLOOM: ['#CDE7FF', '#F7E3FF', '#BAEAD0', '#FCF2BD', '#FDD7DE', '#BCDCF7'],
  KNOWLEDGE: ['#CDE7FF', '#F7E3FF', '#BAEAD0', '#FCF2BD', '#FDD7DE', '#BCDCF7']
}

export const DEVICE = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile'
}

export const WORK_SHOPS_STATUS = {
  SCHEDULE: {
    label: 'Scheduled',
    value: 2
  },
  ONGOING: {
    label: 'On-going',
    value: 1
  },
  ENDED: {
    label: 'Ended',
    value: 3
  }
  // VIDEOSTOWATCH: {
  //   label: 'Videos to watch',
  //   value: 4
  // }
}

export const WORK_SHOPS_TYPE = {
  FEATURE: {
    label: 'Featured',
    value: 1
  },
  LUNCHEDBYME: {
    label: 'Launched by me',
    value: 2
  },
  REGISTERED: {
    label: 'Registered',
    value: 3
  }
}

export const CLASS_TYPE = {
  school: 1,
  personal: 2,
  open: 3, // 开放的班级统称
  self: 4 // self study
}

export const PAID_TYPE = {
  FREE: {
    label: 'Free workshops',
    value: 0
  },
  PAID: {
    label: 'Paid workshops',
    value: 1
  }
}

export const NOTIFY_TYPE = {
  ALL: {
    label: 'All teachers',
    value: 1
  },
  FILTER_SUBJECTS: {
    label: 'Filter teachers by Subjects',
    value: 2
  },
  FILTER_YEARS: {
    label: 'Filter teachers by Years',
    value: 3
  }
}

export const CALENDAR_QUERY_TYPE = {
  WORKSHOP: {
    label: 'My workshops',
    value: 1
  },
  CLASS: {
    label: 'Class',
    value: 2
  },
  MY: {
    label: 'My calendar',
    value: 3
  }
}

export const EXPIRE_UNIT = [
  {
    label: 'day',
    value: 1
  },
  {
    label: 'month',
    value: 2
  },
  {
    label: 'year',
    value: 3
  }
]
