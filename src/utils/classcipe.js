import { AllCurriculums, PlanField, TaskField } from '@/const/common'
import { typeMap } from '@/const/teacher'

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

const sysConfig = {
  sidebarWidth: 230,
  collapsedSidebarWidth: 80
}

export {
  get21stCenturyDisplayNameByCurriculum,
  classcipeCDN,
  typeMap,
  PlanField,
  TaskField,
  sysConfig,
  replaceToClasscipeCDN
}
