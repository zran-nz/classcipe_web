import { AllCurriculums } from '@/const/common'

function get21stCenturyDisplayNameByCurriculum(curriculum) {
  if (curriculum === AllCurriculums.NZ) {
    return 'Key competencies'
  } else if (curriculum === AllCurriculums.AU) {
    return 'General capabilities'
  } else {
    return '21st Century Skills'
  }
}

export {
  get21stCenturyDisplayNameByCurriculum
}
