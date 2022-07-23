import storage from 'store'
import { changeRole, getInfo, login, logout, signUp } from '@/api/login'
import { StudentClasses } from '@/api/selfStudy'
import {
  ACCESS_TOKEN,
  ADD_PREFERENCE_SKIP_TIME,
  CURRENT_ROLE,
  IS_ADD_PREFERENCE,
  SET_CLASS_LIST,
  SET_CURRENT_SCHOOL,
  TOOGLE_USER_MODE,
  USER_INFO
} from '@/store/mutation-types'
import { delCookie, setCookie, welcome } from '@/utils/util'
import * as logger from '@/utils/logger'
import { SESSION_ACTIVE_KEY, USER_MODE } from '@/const/common'
import { teacher } from '@/const/role'
import { myClassesList } from '@/api/v2/classes'
import { appLogin } from '@/api/v2/statsTarget'
import { GetAuCurriculum, GetNzCurriculum } from '@/api/v2/curriculumn'

const user = {
  state: {
    token: '',
    name: '',
    email: '',
    bindCurriculum: '',
    welcome: '',
    avatar: '',
    currentRole: '',
    isAddPreference: false,
    roles: [],
    permissions: [],
    info: {},
    sharedCount: 0,
    sharedFindCount: 0,
    skillCategory: [],
    disableQuestion: false,
    school: '',
    schoolRole: '',
    classList: [],
    currentSchool: {},
    allSubjects: [],
    allYears: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_BIND_CURRICULUM: (state, bindCurriculum) => {
      state.bindCurriculum = bindCurriculum
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_CURRENT_ROLE: (state, currentRole) => {
      state.currentRole = currentRole
    },
    SET_IS_ADD_PREFERENCE: (state, isAddPreference) => {
      state.isAddPreference = isAddPreference
    },
    SET_SHARED_COUNT: (state, sharedCount) => {
      state.sharedCount = sharedCount
    },
    SET_SHARED_FIND_COUNT: (state, sharedFindCount) => {
      state.sharedFindCount = sharedFindCount
    },
    SET_SKILL_CATEGORY: (state, skillCategory) => {
      state.skillCategory = skillCategory
    },
    SET_DISABLED_QUESTION: (state, disableQuestion) => {
      state.disableQuestion = disableQuestion
    },
    SET_CLASS_LIST: (state, classList) => {
      state.classList = classList
    },
    SET_CURRENT_SCHOOL: (state, currentSchool) => {
      if (!currentSchool) {
        currentSchool = { id: '0' }
      }
      state.currentSchool = currentSchool
      state.school = currentSchool.id
      storage.set(SET_CURRENT_SCHOOL, currentSchool)
    },
    SET_SUBJECTS: (state, allSubjects) => {
      state.allSubjects = allSubjects
    },

    SET_YEARS: (state, allYears) => {
      state.allYears = allYears
    }
  },

  actions: {
    // Google 登录
    LoginWithToken ({ commit }, accessToken) {
      return new Promise((resolve, reject) => {
        logger.info('LoginWithToken', accessToken)
        if (accessToken && accessToken.toString().trim()) {
          storage.set(ACCESS_TOKEN, accessToken, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', accessToken)
          window.sessionStorage.setItem(SESSION_ACTIVE_KEY, accessToken)
          setCookie(ACCESS_TOKEN, accessToken)
          appLogin(accessToken)
          resolve()
        } else {
          reject(new Error('illegal token ' + accessToken))
        }
      })
    },

    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          logger.info('Login', response)
          if (response.success) {
            const result = response.result
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            window.sessionStorage.setItem(SESSION_ACTIVE_KEY, result.token)
            setCookie(ACCESS_TOKEN, result.token)
            appLogin(result.token)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          logger.info('Login err')
          reject(error)
        })
      })
    },

    // 注册+登录
    SignUp ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        signUp(userInfo).then(response => {
          logger.info('SignUp', response)
          if (response.success) {
            const result = response.result
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
            window.sessionStorage.setItem(SESSION_ACTIVE_KEY, result.token)
            setCookie(ACCESS_TOKEN, result.token)
            appLogin(result.token)
            resolve(response)
          } else {
            reject(response)
          }
        }).catch(error => {
          logger.info('SignUp err')
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo({ token: storage.get(ACCESS_TOKEN) }).then(response => {
          logger.info('GetInfo result', response)

          if (response.success) {
            const result = response.result
            commit('SET_ROLES', result.currentRole ? [result.currentRole] : [])
            commit('SET_PERMISSIONS', result.currentRole ? [result.currentRole] : [])
            commit('SET_INFO', result)
            commit('SET_NAME', { name: result.nickname, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            commit('SET_EMAIL', result.email)
            commit('SET_BIND_CURRICULUM', result.bindCurriculum)
            commit('SET_SKILL_CATEGORY', result.skillCategory)
            commit('SET_CURRENT_ROLE', result.currentRole)
            commit('SET_IS_ADD_PREFERENCE', result.isAddPreference)
            commit('SET_DISABLED_QUESTION', result.disableQuestion)
            // 没有设置学校默认个人模式
            const userMode = result.school === '0' ? USER_MODE.SELF : USER_MODE.SCHOOL
            storage.set(TOOGLE_USER_MODE, userMode)
            commit(TOOGLE_USER_MODE, userMode)
            const schoolIndex = result.schoolList.findIndex(item => item.id === result.school)
            commit('SET_CURRENT_SCHOOL', schoolIndex > -1 ? result.schoolList[schoolIndex] : null)
            storage.set(CURRENT_ROLE, result.currentRole)
            storage.set(IS_ADD_PREFERENCE, result.isAddPreference)
            storage.set(USER_INFO, result)
            window.sessionStorage.setItem(SESSION_ACTIVE_KEY, storage.get(ACCESS_TOKEN))
            // 交换最新的后台token
            if (result.token && result.currentRole === teacher && storage.get(ACCESS_TOKEN) !== result.token) {
              storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', result.token)
              setCookie(ACCESS_TOKEN, result.token)
              appLogin(result.token)
              window.sessionStorage.setItem(SESSION_ACTIVE_KEY, result.token)
            }
            resolve(response)
          } else {
            reject(response.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    ChangeRole ({ commit }, roleInfo) {
      logger.info('ChangeRole', roleInfo)
      return new Promise((resolve, reject) => {
        changeRole(roleInfo).then(response => {
          logger.info('ChangeRole response', response)
          const result = response.result.userInfo
          commit('SET_ROLES', result.currentRole ? [result.currentRole] : [])
          commit('SET_PERMISSIONS', result.currentRole ? [result.currentRole] : [])
          commit('SET_INFO', result)

          commit('SET_NAME', { name: result.username, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          commit('SET_EMAIL', result.email)
          commit('SET_BIND_CURRICULUM', result.bindCurriculum)
          commit('SET_CURRENT_ROLE', result.currentRole)
          commit('SET_IS_ADD_PREFERENCE', result.isAddPreference)
          // 不同角色菜单不一样需要重新生成
          commit('SET_ROUTERS', [])
          storage.set(CURRENT_ROLE, result.currentRole)
          storage.set(IS_ADD_PREFERENCE, result.isAddPreference)
          storage.set(USER_INFO, result)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_NAME', '')
          commit('SET_EMAIL', '')
          commit('SET_BIND_CURRICULUM', '')
          commit('SET_AVATAR', '')
          commit('SET_INFO', {})
          commit('SET_CURRENT_ROLE', '')
          commit('SET_PERMISSIONS', [])
          commit('SET_IS_ADD_PREFERENCE', false)
          // 不同角色菜单不一样需要重新生成
          commit('SET_ROUTERS', [])
          storage.remove(CURRENT_ROLE)
          storage.remove(ACCESS_TOKEN)
          storage.remove(IS_ADD_PREFERENCE)
          storage.remove(USER_INFO)
          storage.remove(ADD_PREFERENCE_SKIP_TIME)
          storage.remove(SET_CLASS_LIST)
          storage.remove(SET_CURRENT_SCHOOL)
          window.sessionStorage.removeItem(SESSION_ACTIVE_KEY)
          delCookie(ACCESS_TOKEN)
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
        })
      })
    },

    // CLear Info
    ClearAuth ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_NAME', '')
        commit('SET_EMAIL', '')
        commit('SET_BIND_CURRICULUM', '')
        commit('SET_AVATAR', '')
        commit('SET_INFO', {})
        commit('SET_CURRENT_ROLE', '')
        commit('SET_PERMISSIONS', [])
        commit('SET_IS_ADD_PREFERENCE', false)
        // 不同角色菜单不一样需要重新生成
        commit('SET_ROUTERS', [])
        storage.remove(CURRENT_ROLE)
        storage.remove(ACCESS_TOKEN)
        storage.remove(IS_ADD_PREFERENCE)
        storage.remove(USER_INFO)
        window.sessionStorage.removeItem(SESSION_ACTIVE_KEY)
        delCookie(ACCESS_TOKEN)
        resolve()
      })
    },

    // get all class list
    GetClassList({ commit, state }, userMode = USER_MODE.SELF) {
      const remotePromise = state.currentRole === 'student' ? StudentClasses : myClassesList
      return new Promise((resolve, reject) => {
        remotePromise().then((response) => {
          if (response.success) {
            const result = response.result
            commit('SET_CLASS_LIST', result)
            storage.set(SET_CLASS_LIST, result)

            resolve(result)
          } else {
            reject(response.message)
          }
        }).finally(() => {
          resolve()
        })
      })
    },

    GetSubjectsByCurriculum({ commit }, curriculumId) {
      logger.info('GetSubjectsByCurriculum curriculumId ' + curriculumId)
      if (curriculumId) {
        curriculumId = parseInt(curriculumId)
        if (curriculumId === 1) {
          GetAuCurriculum().then(res => {
            console.log('GetAuCurriculum res', res)
            commit('SET_SUBJECTS', res.__subject)
            commit('SET_YEARS', res.__years)
          })
        } else if (curriculumId === 2) {
          GetNzCurriculum().then(res => {
            console.log('GetNzCurriculum res', res)
            commit('SET_SUBJECTS', res.__subject)
            commit('SET_YEARS', res.__years)
          })
        } else {
          GetAuCurriculum().then(res => {
            console.log('GetAuCurriculum res', res)
            commit('SET_SUBJECTS', res.__subject)
            commit('SET_YEARS', res.__years)
          })
          console.warn('no found curriculum, default use GetAuCurriculum ' + curriculumId)
        }
      }
    }
  }
}

export default user
