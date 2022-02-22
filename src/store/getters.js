import { defaultExpertRouter, defaultTeacherRouter, defaultStudentRouter } from '@/config/router.config'
import store from '@/store'

const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  sysConfig: state => state.app.sysConfig,
  downloadUrl: state => state.app.downloadUrl,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  email: state => state.user.email,
  bindCurriculum: state => state.user.bindCurriculum,
  welcome: state => state.user.welcome,
  currentRole: state => state.user.currentRole,
  roles: state => state.user.roles,
  isAddPreference: state => state.user.isAddPreference,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  defaultRouter: state => {
    return state.user.currentRole === 'expert' ? defaultExpertRouter
          : state.user.currentRole === 'teacher' ? defaultTeacherRouter
          : defaultStudentRouter
  },
  sharedCount: state => state.user.sharedCount,
  sharedFindCount: state => state.user.sharedFindCount,
  skillCategory: state => state.user.skillCategory,
  disableQuestion: state => state.user.disableQuestion,
  school: state => state.user.school,
  schoolRole: state => state.user.schoolRole,
  vueSocket: state => {
    if (state.websocket.vueSocket) {
      return state.websocket.vueSocket
    } else {
      store.dispatch('initData')
      return state.websocket.vueSocket
    }
  },

  evaluationSet: state => state.websocket.evaluationSet
}

export default getters
