import { AllCurriculums, PdField, PlanField, TaskField, VideoField } from '@/const/common'
import { typeMap } from '@/const/teacher'
import ScheduleSteps from '@/components/Schedule/ScheduleSteps'
import ScheduleSessionType from '@/components/Schedule/ScheduleSessionType'

const classcipeCDN = 'https://d1nk0uvaoq8fwq.cloudfront.net/'

function get21stCenturyDisplayNameByCurriculum(curriculum) {
  if (curriculum === AllCurriculums.NZ) {
    return 'Key competencies'
  } else if (curriculum === AllCurriculums.AU) {
    return 'General capabilities'
  } else {
    return '21st Century Skills'
  }
}

/**
 * 替换当前域名为classcipe CDN域名
 */
function replaceToClasscipeCDN(rawUrl) {
  // 如果已经是cdn域名，则直接返回
  if (rawUrl.indexOf('cloudfront.net') > -1) {
    return rawUrl
  }
  // 域名带有http://或https://
  if (rawUrl.indexOf('https://') === 0 || rawUrl.indexOf('http://') === 0) {
    return classcipeCDN + (rawUrl.split('/').slice(3).join('/'))
  } else {
    // 一开始就是域名
    return classcipeCDN + (rawUrl.split('/').slice(1).join('/'))
  }
}

function getContentTypeName(type) {
  switch (type) {
    case typeMap['unit-plan']:
      return 'unit'
    case typeMap.task:
      return 'task'
    case typeMap.video:
      return 'video'
    case typeMap.pd:
      return 'pd'
    default:
      break
  }
}

function setRequiredCheck(contentId) {
  window.sessionStorage.setItem('required-check-' + contentId, 'true')
}

function unSetRequiredCheck(contentId) {
  window.sessionStorage.removeItem('required-check-' + contentId)
}

const sysConfig = {
  sidebarWidth: 230,
  collapsedSidebarWidth: 80
}

const planRequiredFields = [PlanField.Name, PlanField.Image, PlanField.Inquiry, PlanField.Question, PlanField.SubjectIds, PlanField.GradeIds, PlanField.LearnOuts]
const taskRequiredFields = [TaskField.GradeIds, TaskField.SubjectIds, TaskField.Slides, TaskField.Name, TaskField.Image, TaskField.Overview, TaskField.TaskType, TaskField.LearnOuts, TaskField.Question]
const pdRequiredFields = [PdField.Name, PdField.Image, PdField.Goals, PdField.Slides]
const videoRequiredFields = [VideoField.Name, VideoField.Video, VideoField.ContentType, VideoField.CoverImage]

export {
  get21stCenturyDisplayNameByCurriculum,
  classcipeCDN,
  typeMap,
  PlanField,
  TaskField,
  sysConfig,
  getContentTypeName,
  ScheduleSteps,
  ScheduleSessionType,
  replaceToClasscipeCDN,
  setRequiredCheck,
  unSetRequiredCheck,
  planRequiredFields,
  taskRequiredFields,
  pdRequiredFields,
  videoRequiredFields
}
