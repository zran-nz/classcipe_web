import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, CURRENT_ROLE } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { defaultExpertRouter, defaultStudentRouter, defaultTeacherRouter } from '@/config/router.config'
import * as logger from '@/utils/logger'
import { SESSION_ACTIVE_KEY } from '@/const/common'
import { getToken, setCookie } from './utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'resetPassword', 'registerResult', 'authResult', 'authCheck', 'pageRedirect', 'addonCallback', 'classGoBack', 'authRedirect', 'shareDetail', 'authSuccess'] // no redirect allowList
const loginRoutePath = '/user/login'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))

  /* has token */
  logger.info('router', to)

  const role = to.fullPath.indexOf('student') > -1 ? 'student' : 'teacher'
  if (allowList.includes(to.name) && to.name) {
    // 在免登录名单，直接进入
    logger.info('allowList ', to.name)
    next()
  } else if (getToken()) {
    /*  set new Token By Url */
    const token = to.query.token || from.query.token
    if (token) {
      storage.set(ACCESS_TOKEN, token)
      window.sessionStorage.setItem(SESSION_ACTIVE_KEY, token)
      setCookie(ACCESS_TOKEN, token)
    }
    const accessToken = getToken()
    logger.info('accessToken check', accessToken)
    if (accessToken) {
      if (to.path === loginRoutePath) {
        const defaultRoutePath = storage.get(CURRENT_ROLE) === 'expert' ? defaultExpertRouter
         : storage.get(CURRENT_ROLE) === 'teacher' ? defaultTeacherRouter : defaultStudentRouter
        next({ path: defaultRoutePath })
        NProgress.done()
      } else {
        // 检查是否已经获取了用户信息
        logger.info('router check roles ', store.getters.roles)
        if (store.getters.roles.length === 0 || store.getters.addRouters.length === 0) {
          // request login userInfo
          store
            .dispatch('GetInfo')
            .then(res => {
              const currentRole = res.result && res.result.currentRole
              // generate dynamic router
              store.dispatch('GenerateRoutes', { roles: { permissionList: [currentRole] } }).then(() => {
                // 根据roles权限生成可访问的路由表
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)
                // 请求带有 redirect 重定向时，登录自动重定向到该地址
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                logger.info('redirect ' + redirect)
                if (to.path === redirect) {
                  // set the replace: true so the navigation will not leave a history record
                  logger.info('redirect to next ', { ...to, replace: true })
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
            })
            .catch(() => {
              logger.error({
                message: 'Error',
                description: 'Failed to get userinfo, Please try again!'
              })
              // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
              store.dispatch('ClearAuth').then(() => {
                next({ path: loginRoutePath, query: { redirect: to.fullPath, role } })
              })
            })
        } else {
          next()
        }
      }
    } else {
      next()
    }
  } else {
    console.log(to)
      next({ path: loginRoutePath, query: { redirect: to.fullPath, role } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
