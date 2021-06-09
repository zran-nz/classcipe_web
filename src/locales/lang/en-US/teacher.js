import myContent from './teacher/myContent'
import addUnitPlan from './teacher/addUnitPlan'
import myFavorite from './teacher/myFavorite'
import shared from './teacher/shared'
import main from './teacher/main'

export default {
  ...main,
  ...myContent,
  ...myFavorite,
  ...shared,
  ...addUnitPlan
}
