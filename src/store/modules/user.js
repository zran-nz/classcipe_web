import storage from 'store'
import { login, getInfo, logout, changeRole } from '@/api/login'
import { ACCESS_TOKEN, CURRENT_ROLE, IS_ADD_PREFERENCE, USER_INFO } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import * as logger from '@/utils/logger'
import { SESSION_ACTIVE_KEY } from '@/const/common'

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
    school: ''
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
      logger.info('SET_CURRENT_ROLE', currentRole)
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
          const result = response.result
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', result.token)
          window.sessionStorage.setItem(SESSION_ACTIVE_KEY, result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo({ token: storage.get(ACCESS_TOKEN) }).then(response => {
          logger.info('GetInfo', response)
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
          storage.set(CURRENT_ROLE, result.currentRole)
          storage.set(IS_ADD_PREFERENCE, result.isAddPreference)
          storage.set(USER_INFO, result)
          window.sessionStorage.setItem(SESSION_ACTIVE_KEY, storage.get(ACCESS_TOKEN))
          resolve(response)
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
          storage.remove(CURRENT_ROLE)
          storage.remove(ACCESS_TOKEN)
          storage.remove(IS_ADD_PREFERENCE)
          storage.remove(USER_INFO)
          window.sessionStorage.removeItem(SESSION_ACTIVE_KEY)
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
        storage.remove(CURRENT_ROLE)
        storage.remove(ACCESS_TOKEN)
        storage.remove(IS_ADD_PREFERENCE)
        storage.remove(USER_INFO)
        window.sessionStorage.removeItem(SESSION_ACTIVE_KEY)
        resolve()
      })
    }
  }
}

export default user
