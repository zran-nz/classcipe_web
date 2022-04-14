import { AllCurriculums } from '@/const/common'

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
  // 域名带有http://或https://
  if (rawUrl.indexOf('https://') === 0 || rawUrl.indexOf('http://') === 0) {
    return classcipeCDN + (rawUrl.split('/').slice(3).join('/'))
  } else {
    // 一开始就是域名
    return classcipeCDN + (rawUrl.split('/').slice(1).join('/'))
  }
}

export {
  get21stCenturyDisplayNameByCurriculum,
  classcipeCDN,
  replaceToClasscipeCDN
}
