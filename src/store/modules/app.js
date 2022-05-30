import storage from 'store'
import {
  APP_LANGUAGE,
  DOWNLOAD_URL,
  HIDDEN_SIDEBAR,
  SYS_CONFIG,
  TOGGLE_COLOR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_HIDE_HEADER,
  TOGGLE_LAYOUT,
  TOGGLE_MOBILE_TYPE,
  TOGGLE_MULTI_TAB,
  TOGGLE_NAV_THEME,
  TOGGLE_WEAK,
  TOOGLE_USER_MODE,
  HIDDEN_HEADER,
  TOGGLE_DEVICE,
  SET_PROMOTE_CODE
} from '@/store/mutation-types'
import { loadLanguageAsync } from '@/locales'
import { getSysConfig } from '@/api/common'
import * as logger from '@/utils/logger'
import { USER_MODE, DEVICE } from '@/const/common'
import { setCookie } from '@/utils/util'

const app = {
  state: {
    sideCollapsed: false,
    hiddenHeader: false,
    isMobile: false,
    theme: 'dark',
    layout: '',
    contentWidth: '',
    fixedHeader: false,
    fixedSidebar: false,
    autoHideHeader: false,
    color: '',
    weak: false,
    multiTab: true,
    lang: 'en-US',
    _antLocale: {},
    sysConfig: null,
    downloadUrl: '',
    userMode: USER_MODE.SELF, // selfStudy: 自学习模式，schoolStudy：学校模式
    device: DEVICE.DESKTOP,
    promoteCode: ''
  },
  mutations: {
    [HIDDEN_SIDEBAR]: (state, type) => {
      logger.info(HIDDEN_SIDEBAR + ' ' + type)
      state.sideCollapsed = type
      storage.set(HIDDEN_SIDEBAR, type)
    },
    [HIDDEN_HEADER]: (state, hidden) => {
      state.hiddenHeader = hidden
      storage.set(HIDDEN_HEADER, hidden)
    },
    [TOGGLE_MOBILE_TYPE]: (state, isMobile) => {
      state.isMobile = isMobile
    },
    [TOGGLE_NAV_THEME]: (state, theme) => {
      state.theme = theme
      storage.set(TOGGLE_NAV_THEME, theme)
    },
    [TOGGLE_LAYOUT]: (state, mode) => {
      state.layout = mode
      storage.set(TOGGLE_LAYOUT, mode)
    },
    [TOGGLE_FIXED_HEADER]: (state, mode) => {
      state.fixedHeader = mode
      storage.set(TOGGLE_FIXED_HEADER, mode)
    },
    [TOGGLE_FIXED_SIDEBAR]: (state, mode) => {
      state.fixedSidebar = mode
      storage.set(TOGGLE_FIXED_SIDEBAR, mode)
    },
    [TOGGLE_CONTENT_WIDTH]: (state, type) => {
      state.contentWidth = type
      storage.set(TOGGLE_CONTENT_WIDTH, type)
    },
    [TOGGLE_HIDE_HEADER]: (state, type) => {
      state.autoHideHeader = type
      storage.set(TOGGLE_HIDE_HEADER, type)
    },
    [TOGGLE_COLOR]: (state, color) => {
      state.color = color
      storage.set(TOGGLE_COLOR, color)
    },
    [TOGGLE_WEAK]: (state, mode) => {
      state.weak = mode
      storage.set(TOGGLE_WEAK, mode)
    },
    [APP_LANGUAGE]: (state, lang, antd = {}) => {
      state.lang = lang
      state._antLocale = antd
      storage.set(APP_LANGUAGE, lang)
    },
    [TOGGLE_MULTI_TAB]: (state, bool) => {
      storage.set(TOGGLE_MULTI_TAB, bool)
      state.multiTab = bool
    },
    [SYS_CONFIG]: (state, sysConfig) => {
      state.sysConfig = sysConfig
    },
    [DOWNLOAD_URL]: (state, downloadUrl) => {
      state.downloadUrl = downloadUrl
    },
    [TOOGLE_USER_MODE]: (state, userMode) => {
      state.userMode = userMode
      storage.set(TOOGLE_USER_MODE, userMode)
    },
    [TOGGLE_DEVICE]: (state, device) => {
      state.device = device
    },
    [SET_PROMOTE_CODE]: (state, promoteCode) => {
      state.promoteCode = promoteCode
      storage.set(SET_PROMOTE_CODE, promoteCode)
      setCookie(SET_PROMOTE_CODE, promoteCode)
    }
  },
  actions: {
    setLang ({ commit }, lang) {
      return new Promise((resolve, reject) => {
        commit(APP_LANGUAGE, lang)
        loadLanguageAsync(lang).then(() => {
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    },
    getSysConfig ({ commit }) {
      return new Promise((resolve, reject) => {
        getSysConfig().then(response => {
          const result = response.result
          logger.info('getSysConfig', result)
          const config = {}
          result.forEach(item => {
            config[item.title] = item.value
          })
          commit(SYS_CONFIG, config)
          logger.info('config detail', config)
          if (config.downloadUrl) {
            commit(DOWNLOAD_URL, config.downloadUrl)
          }
          resolve(result)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default app
