import myContent from './teacher/myContent'
import material from './teacher/material'
import addUnitPlan from './teacher/addUnitPlan'
import myFavorite from './teacher/myFavorite'
import shared from './teacher/shared'
import main from './teacher/main'
import unitPlanPreview from './teacher/unitPlanPreview'
import addTask from './teacher/addTask'
import addLesson from './teacher/addLesson'

export default {
  ...unitPlanPreview,
  ...main,
  ...material,
  ...myContent,
  ...myFavorite,
  ...shared,
  ...addUnitPlan,
  ...addTask,
  ...addLesson
}
