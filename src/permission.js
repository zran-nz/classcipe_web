import router from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, CURRENT_ROLE, IS_ADD_PREFERENCE } from '@/store/mutation-types'
import { i18nRender } from '@/locales'
import { addPreferenceRouter, defaultDashboardRouter, selectRoleRouter } from '@/config/router.config'
import * as logger from '@/utils/logger'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult', 'authResult'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = defaultDashboardRouter

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`))
  /* has token */
  logger.info('router', to)
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === selectRoleRouter) {
      logger.info(' allow user select a role')
      next()
      NProgress.done()
    } else if (!storage.get(CURRENT_ROLE)) {
      logger.info('user must select a role first', storage.get(CURRENT_ROLE))
      next({ path: selectRoleRouter })
      NProgress.done()
    } else if (!storage.get(IS_ADD_PREFERENCE) && to.path === addPreferenceRouter) {
      logger.info('allow user add preference')
      next()
      NProgress.done()
    } else if (!storage.get(IS_ADD_PREFERENCE)) {
      logger.info('user must add preference')
      next({ path: addPreferenceRouter })
      NProgress.done()
    } else if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      // check login user.currentRole is null
      if (!store.getters.userInfo) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then(res => {
            const roles = res.result && res.result.roles
            // generate dynamic router
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters)
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              const redirect = decodeURIComponent(from.query.redirect || to.path)
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
            store.dispatch('Logout').then(() => {
              next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
