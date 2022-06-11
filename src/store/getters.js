import { defaultExpertRouter, defaultTeacherRouter, defaultStudentRouter } from '@/config/router.config'
import store from '@/store'
import { AllCurriculums, USER_MODE } from '@/const/common'

const getters = {
  isMobile: state => state.app.isMobile,
  collapsed: state => state.app.sideCollapsed,
  hiddenHeader: state => state.app.hiddenHeader,
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
  schoolName: state => state.user.currentSchool.schoolName,
  schoolRole: state => state.user.currentSchool.roleNames,
  vueSocket: state => {
    if (state.websocket.vueSocket) {
      return state.websocket.vueSocket
    } else {
      store.dispatch('initData')
      return state.websocket.vueSocket
    }
  },
  formConfigData: state => state.formConfig.formConfigData,

  // 暂时隐藏 karen: "因为IB的版权问题，现在需要把我们平台上的一部分大纲条隐藏掉，把IB-MYP的achievement objectives和integrated subject skills都隐藏了，只有我在后台把老师设置成IB Pilot school 这个学校的才能看到"
  // hiddenIbCurriculumId: state => state.user.info.bindCurriculum === AllCurriculums.IBMYP && state.user.info.school !== '1468390544921169921',
  hiddenIbCurriculumId: state => false,

  currentClassList: state => {
    // return state.user.classList.filter(item => item.schoolId === state.user.school)
    let currentSchool = state.user.currentSchool
    if (!currentSchool.id) {
      currentSchool = (state.user.info.schoolList && state.user.info.schoolList.length > 0) ? state.user.info.schoolList[0] : { id: -1 }
    }
    let currentSchoolId = null
    // 老师端的个人模式，学校id强制为空
    if (state.user.currentRole === 'student' || state.app.userMode === USER_MODE.SCHOOL) {
      currentSchoolId = currentSchool.id
    }
    return state.user.classList.filter(item => item.schoolId === currentSchoolId)
  },
  isIBTeacher: state => state.user.currentRole === 'teacher' && (state.user.bindCurriculum === AllCurriculums.IBMYP || state.user.bindCurriculum === AllCurriculums.IBPYP),

  allSubjects: state => state.user.allSubjects,
  userSubjects: state => state.user.allSubjects.filter(item => state.user.info.preference.subjectIds.includes(item.id)),

  curriculumList: state => state.classcipeConfig.curriculumList,
  curriculumId2NameMap: state => state.classcipeConfig.curriculumId2NameMap,

  pubTagList: state => state.classcipeConfig.pubTagList,
  priTagList: state => state.classcipeConfig.priTagList
}

export default getters
