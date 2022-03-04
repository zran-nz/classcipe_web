import storage from 'store'
import {
  FORM_CONFIG_PREVIEW_DATA,
  FORM_CONFIG_DATA
} from '@/store/mutation-types'
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
      state.previewData = previewData
      storage.set(FORM_CONFIG_PREVIEW_DATA, previewData)
    },
    [FORM_CONFIG_DATA]: (state, formConfigData) => {
      logger.info('formConfigData', formConfigData)
      const configData = {
        taskFieldMap: {},
        taskCommonList: [],
        taskCustomList: [],
        planFieldMap: {},
        planCommonList: [],
        planCustomList: []
      }
      formConfigData.task.commonList.forEach(item => {
        configData.taskFieldMap[item.fieldName] = item.showName
      })
      configData.taskCommonList = formConfigData.task.commonList
      configData.taskCustomList = formConfigData.task.customList

      formConfigData.plan.commonList.forEach(item => {
        configData.planFieldMap[item.fieldName] = item.showName
      })
      configData.planCommonList = formConfigData.plan.commonList
      configData.planCustomList = formConfigData.plan.customList

      state.formConfigData = configData
      logger.info('format formConfigData', configData)
      storage.set(FORM_CONFIG_DATA, configData)
    }
  },
  actions: {
    loadFormConfigData ({ commit }) {
      return new Promise((resolve, reject) => {
        FormConfigUser().then(response => {
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
