import storage from 'store'
import { FORM_CONFIG_DATA, FORM_CONFIG_PREVIEW_DATA } from '@/store/mutation-types'
import { typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import { FormConfigUser } from '@/api/formConfig'

const formConfig = {
  state: {
    formConfigData: {
      loaded: false,
      taskFieldMap: {},
      taskFieldLabelMap: {},
      taskHintMap: {},
      taskCommonList: [],
      taskCustomList: [],
      taskFieldTagMap: {},
      planFieldMap: {},
      planFieldLabelMap: {},
      planHintMap: {},
      planCommonList: [],
      planCustomList: [],
      planFieldTagMap: {}
    }
  },
  mutations: {
    [FORM_CONFIG_PREVIEW_DATA]: (state, previewData) => {
      logger.info('previewData', previewData)
      const configData = {
        loaded: true,
        taskFieldMap: {},
        taskFieldLabelMap: {},
        taskHintMap: {},
        taskCommonList: [],
        taskCustomList: [],
        taskFieldTagMap: {},
        taskSteps: [],
        planFieldMap: {},
        planFieldLabelMap: {},
        planHintMap: {},
        planCommonList: [],
        planCustomList: [],
        planFieldTagMap: {},
        planSteps: []
      }
      if (previewData.type === typeMap.task) {
        previewData.commonList.forEach(item => {
          configData.taskFieldMap[item.fieldName] = item.showName
          configData.taskHintMap[item.fieldName] = item.hint
          configData.taskFieldTagMap[item.fieldName] = item.tags
          configData.taskFieldLabelMap[item.fieldName] = item.fieldLabel
        })
        configData.taskCommonList = previewData.commonList
        configData.taskCustomList = previewData.customList
        previewData.customList.forEach(item => {
          configData.taskFieldTagMap['cust_' + item.name] = item.tags
        })
        previewData.steps.forEach(step => {
          step.showRequiredTips = false
          step.showSatisfiedTips = false
        })
        configData.taskSteps = previewData.steps.sort((a, b) => {
          return a.step - b.step
        })
      }

      if (previewData.type === typeMap['unit-plan']) {
        previewData.commonList.forEach(item => {
          configData.planFieldMap[item.fieldName] = item.showName
          configData.planHintMap[item.fieldName] = item.hint
          configData.planFieldTagMap[item.fieldName] = item.tags
          configData.planFieldLabelMap[item.fieldName] = item.fieldLabel
        })
        configData.planCommonList = previewData.commonList
        configData.planCustomList = previewData.customList
        previewData.customList.forEach(item => {
          configData.planFieldTagMap['cust_' + item.name] = item.tags
        })
        previewData.steps.forEach(step => {
          step.showRequiredTips = false
          step.showSatisfiedTips = false
        })
        configData.planSteps = previewData.steps.sort((a, b) => {
          return a.step - b.step
        })
      }
      storage.set(FORM_CONFIG_PREVIEW_DATA, configData)
    },
    [FORM_CONFIG_DATA]: (state, formConfigData) => {
      logger.info('formConfigData', formConfigData)
      const configData = {
        loaded: true,
        taskFieldMap: {},
        taskFieldLabelMap: {},
        taskHintMap: {},
        taskCommonList: [],
        taskCustomList: [],
        taskFieldTagMap: {},
        taskSteps: [],
        planFieldMap: {},
        planHintMap: {},
        planFieldLabelMap: {},
        planCommonList: [],
        planCustomList: [],
        planFieldTagMap: {},
        planSteps: []
      }
      if (formConfigData) {
        formConfigData.task.commonList.forEach(item => {
          configData.taskFieldMap[item.fieldName] = item.showName
          configData.taskHintMap[item.fieldName] = item.hint
          configData.taskFieldTagMap[item.fieldName] = item.tags
          configData.taskFieldLabelMap[item.fieldName] = item.fieldLabel
        })
        configData.taskCommonList = formConfigData.task.commonList
        configData.taskCustomList = formConfigData.task.customList
        formConfigData.task.customList.forEach(item => {
          configData.taskFieldTagMap['cust_' + item.name] = item.tags
        })
        formConfigData.task.steps.forEach(step => {
            step.showRequiredTips = false
            step.showSatisfiedTips = false
        })
        configData.taskSteps = formConfigData.task.steps.sort((a, b) => {
          return a.step - b.step
        })

        formConfigData.plan.commonList.forEach(item => {
          configData.planFieldMap[item.fieldName] = item.showName
          configData.planHintMap[item.fieldName] = item.hint
          configData.planFieldTagMap[item.fieldName] = item.tags
          configData.planFieldLabelMap[item.fieldName] = item.fieldLabel
        })
        configData.planCommonList = formConfigData.plan.commonList
        configData.planCustomList = formConfigData.plan.customList
        formConfigData.plan.customList.forEach(item => {
          configData.planFieldTagMap['cust_' + item.name] = item.tags
        })
        formConfigData.plan.steps.forEach(step => {
          step.showRequiredTips = false
          step.showSatisfiedTips = false
        })
        configData.planSteps = formConfigData.plan.steps.sort((a, b) => {
          return a.step - b.step
        })
      }
      state.formConfigData = configData
      logger.info('format formConfigData', configData)
      storage.set(FORM_CONFIG_DATA, configData)
    }
  },
  actions: {
    loadFormConfigData ({ commit }, token) {
      return new Promise((resolve, reject) => {
        FormConfigUser({ token: token }).then(response => {
          logger.info('init formConfigData', response.result)
          commit(FORM_CONFIG_DATA, response.result)
          resolve(response.result)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default formConfig
