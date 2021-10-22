import router from './router'
import store from './store'
import { SESSION_ACTIVE_KEY } from './const/common'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, CURRENT_ROLE, IS_ADD_PREFERENCE } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { addPreferenceRouter, defaultTeacherRouter, defaultExpertRouter, selectRoleRouter } from '@/config/router.config'
import * as logger from '@/utils/logger'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult', 'authResult', 'authCheck', 'AddonPreview', 'PageRedirect'] // no redirect allowList
const loginRoutePath = '/user/login'
const authCheckPath = '/user/auth-check'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))

  /* has token */
  logger.info('router', to)
  if (allowList.includes(to.name)) {
    // 在免登录名单，直接进入
    logger.info('allowList ', to.name)
    next()
  } else if (storage.get(ACCESS_TOKEN) && to.path !== authCheckPath) {
    /*  set new Token By Url */
    const token = to.query.token || from.query.token
    if (token) {
      storage.set(ACCESS_TOKEN, token)
      window.sessionStorage.setItem(SESSION_ACTIVE_KEY, token)
    }
    const sessionActive = window.sessionStorage.getItem(SESSION_ACTIVE_KEY)
    logger.info('sessionActive check', sessionActive)
    if (sessionActive) {
    // 检查角色信息是否完善
      if (to.path === selectRoleRouter) {
        logger.info(' allow user select a role')
        next()
        NProgress.done()
      } else if (!storage.get(CURRENT_ROLE)) {
        logger.info('user must select a role first', storage.get(CURRENT_ROLE))
        next({ path: selectRoleRouter })
        NProgress.done()
        // eslint-disable-next-line brace-style
      }
      // 检查个人信息是否完善
      else if (!storage.get(IS_ADD_PREFERENCE) && to.path === addPreferenceRouter) {
        logger.info('allow user add preference')
        next()
        NProgress.done()
      } else if (!storage.get(IS_ADD_PREFERENCE)) {
        logger.info('user must add preference')
        next({ path: addPreferenceRouter })
        NProgress.done()
      } else if (to.path === loginRoutePath) {
        const defaultRoutePath = storage.get(CURRENT_ROLE) === 'expert' ? defaultExpertRouter : defaultTeacherRouter
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
                  next({ ...to, replace: true })
                } else {
                  // 跳转到目的路由
                  next({ path: redirect })
                }
              })
            })
            .catch(() => {
              notification.error({
                message: 'Error',
                description: 'Failed to get userinfo, Please try again!'
              })
              // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
              store.dispatch('ClearAuth').then(() => {
                next({ path: loginRoutePath, query: { redirect: to.fullPath } })
              })
            })
        } else {
          next()
        }
      }
    } else {
      logger.info('go to authCheckPath')
      next({ path: authCheckPath, query: { redirect: to.fullPath } })
    }
  } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
