import { PlanField, TaskField } from '@/const/common'

export const FormConfigMixin = {
  data () {
    return {
      PlanField: PlanField,
      taskField: TaskField
    }
  },
  filters: {
    unitLabelName: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planFieldMap && formConfigData.planFieldMap[fieldName]) {
        return formConfigData.planFieldMap[fieldName]
      } else {
        return defaultName
      }
    },
    unitLabelHint: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planHintMap && formConfigData.planHintMap[fieldName]) {
        return formConfigData.planHintMap[fieldName]
      } else {
        return defaultName
      }
    },
    taskLabelName: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskFieldMap && formConfigData.taskFieldMap[fieldName]) {
        return formConfigData.taskFieldMap[fieldName]
      } else {
        return defaultName
      }
    },
    taskLabelHint: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskHintMap && formConfigData.taskHintMap[fieldName]) {
        return formConfigData.taskHintMap[fieldName]
      } else {
        return defaultName
      }
    }
  }
}
