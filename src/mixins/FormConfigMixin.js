import { PlanField, TaskField } from '@/const/common'

export const FormConfigMixin = {
  data () {
    return {
      PlanField: PlanField,
      taskField: TaskField,
      formConfigPreviewData: null
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
    unitFieldLabel: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planFieldLabelMap && formConfigData.planFieldLabelMap[fieldName]) {
        return formConfigData.planFieldLabelMap[fieldName]
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
    taskFieldLabel: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskFieldLabelMap && formConfigData.taskFieldLabelMap[fieldName]) {
        return formConfigData.taskFieldLabelMap[fieldName]
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
  },
  methods: {
    unitLabelName: (fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planFieldMap && formConfigData.planFieldMap[fieldName]) {
        return formConfigData.planFieldMap[fieldName]
      } else {
        return null
      }
    },
    unitLabelHint: (fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planHintMap && formConfigData.planHintMap[fieldName]) {
        return formConfigData.planHintMap[fieldName]
      } else {
        return null
      }
    },
    unitFieldLabel: (fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planFieldLabelMap && formConfigData.planFieldLabelMap[fieldName]) {
        return formConfigData.planFieldLabelMap[fieldName]
      } else {
        return null
      }
    },
    taskLabelName: (fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskFieldMap && formConfigData.taskFieldMap[fieldName]) {
        return formConfigData.taskFieldMap[fieldName]
      } else {
        return null
      }
    },
    taskLabelHint: (fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskHintMap && formConfigData.taskHintMap[fieldName]) {
        return formConfigData.taskHintMap[fieldName]
      } else {
        return null
      }
    },
    taskFieldLabel: (fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskFieldLabelMap && formConfigData.taskFieldLabelMap[fieldName]) {
        return formConfigData.taskFieldLabelMap[fieldName]
      } else {
        return null
      }
    }
  }
}
