import myContent from './teacher/myContent'
import addUnitPlan from './teacher/addUnitPlan'
import myFavorite from './teacher/myFavorite'
import shared from './teacher/shared'
import main from './teacher/main'
import unitPlanPreview from './teacher/unitPlanPreview'

export default {
  ...unitPlanPreview,
  ...main,
  ...myContent,
  ...myFavorite,
  ...shared,
  ...addUnitPlan
}
