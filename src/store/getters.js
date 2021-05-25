import { defaultExpertRouter, defaultTeacherRouter } from '@/config/router.config'

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
  defaultRouter: state => state.user.currentRole === 'expert' ? defaultExpertRouter : defaultTeacherRouter
}

export default getters
