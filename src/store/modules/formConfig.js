import storage from 'store'
import {
  FORM_CONFIG_PREVIEW_DATA,
  FORM_CONFIG_DATA, ACCESS_TOKEN
} from '@/store/mutation-types'
import { typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import { FormConfigUser } from '@/api/formConfig'

const formConfig = {
  state: {
    previewData: null,
    formConfigData: null
  },
  mutations: {
    [FORM_CONFIG_PREVIEW_DATA]: (state, previewData) => {
      logger.info('previewData', previewData)
      const configData = {
        taskFieldMap: {},
        taskHintMap: {},
        taskCommonList: [],
        taskCustomList: [],
        planFieldMap: {},
        planHintMap: {},
        planCommonList: [],
        planCustomList: []
      }
      if (previewData.type === typeMap.task) {
        previewData.commonList.forEach(item => {
          configData.taskFieldMap[item.fieldName] = item.showName
          configData.taskHintMap[item.fieldName] = item.hint
        })
        configData.taskCommonList = previewData.commonList
        configData.taskCustomList = previewData.customList
      }

      if (previewData.type === typeMap['unit-plan']) {
        previewData.commonList.forEach(item => {
          configData.planFieldMap[item.fieldName] = item.showName
          configData.planHintMap[item.fieldName] = item.hint
        })
        configData.planCommonList = previewData.commonList
        configData.planCustomList = previewData.customList
      }

      state.previewData = configData
      storage.set(FORM_CONFIG_PREVIEW_DATA, previewData)
    },
    [FORM_CONFIG_DATA]: (state, formConfigData) => {
      logger.info('formConfigData', formConfigData)
      const configData = {
        taskFieldMap: {},
        taskHintMap: {},
        taskCommonList: [],
        taskCustomList: [],
        planFieldMap: {},
        planHintMap: {},
        planCommonList: [],
        planCustomList: []
      }
      formConfigData.task.commonList.forEach(item => {
        configData.taskFieldMap[item.fieldName] = item.showName
        configData.taskHintMap[item.fieldName] = item.hint
      })
      configData.taskCommonList = formConfigData.task.commonList
      configData.taskCustomList = formConfigData.task.customList

      formConfigData.plan.commonList.forEach(item => {
        configData.planFieldMap[item.fieldName] = item.showName
        configData.planHintMap[item.fieldName] = item.hint
      })
      configData.planCommonList = formConfigData.plan.commonList
      configData.planCustomList = formConfigData.plan.customList

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
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default formConfig
