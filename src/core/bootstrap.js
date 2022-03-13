import store from '@/store'
import storage from 'store'
import {
  ACCESS_TOKEN,
  CURRENT_ROLE,
  APP_LANGUAGE,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR, TOGGLE_HIDE_HEADER,
  TOGGLE_LAYOUT, TOGGLE_NAV_THEME, TOGGLE_WEAK,
  TOGGLE_COLOR, TOGGLE_MULTI_TAB, USER_INFO,
  TOOGLE_STUDY_MODE,
  SET_STUDENT_CLASS_LIST,
  SET_STUDENT_CURRENT_SCHOOL
} from '@/store/mutation-types'
import defaultSettings from '@/config/defaultSettings'

export default function Initializer () {
  console.log('----------------------------- bootstrap -----------------------------')
  store.commit(TOGGLE_LAYOUT, storage.get(TOGGLE_LAYOUT, defaultSettings.layout))
  store.commit(TOGGLE_FIXED_HEADER, storage.get(TOGGLE_FIXED_HEADER, defaultSettings.fixedHeader))
  store.commit(TOGGLE_FIXED_SIDEBAR, storage.get(TOGGLE_FIXED_SIDEBAR, defaultSettings.fixSiderbar))
  store.commit(TOGGLE_CONTENT_WIDTH, storage.get(TOGGLE_CONTENT_WIDTH, defaultSettings.contentWidth))
  store.commit(TOGGLE_HIDE_HEADER, storage.get(TOGGLE_HIDE_HEADER, defaultSettings.autoHideHeader))
  store.commit(TOGGLE_NAV_THEME, storage.get(TOGGLE_NAV_THEME, defaultSettings.navTheme))
  store.commit(TOGGLE_WEAK, storage.get(TOGGLE_WEAK, defaultSettings.colorWeak))
  store.commit(TOGGLE_COLOR, storage.get(TOGGLE_COLOR, defaultSettings.primaryColor))
  store.commit(TOGGLE_MULTI_TAB, storage.get(TOGGLE_MULTI_TAB, defaultSettings.multiTab))
  store.commit('SET_TOKEN', storage.get(ACCESS_TOKEN))
  store.commit('SET_CURRENT_ROLE', storage.get(CURRENT_ROLE))
  store.commit('SET_INFO', storage.get(USER_INFO))
  store.commit(TOOGLE_STUDY_MODE, storage.get(TOOGLE_STUDY_MODE, 'selfStudy'))
  store.commit('SET_STUDENT_CURRENT_SCHOOL', storage.get(SET_STUDENT_CURRENT_SCHOOL, {}))
  store.commit('SET_STUDENT_CLASS_LIST', storage.get(SET_STUDENT_CLASS_LIST, []))

  store.dispatch('setLang', storage.get(APP_LANGUAGE, 'en-US'))
  store.dispatch('getSysConfig')
  // last step
}
