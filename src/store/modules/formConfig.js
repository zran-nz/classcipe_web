import storage from 'store'
import {
  FORM_CONFIG_PREVIEW_DATA,
  FORM_CONFIG_DATA
} from '@/store/mutation-types'
import * as logger from '@/utils/logger'

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
      state.formConfigData = formConfigData
      storage.set(FORM_CONFIG_DATA, formConfigData)
    }
  }
}

export default formConfig
