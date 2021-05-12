// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    children: [
      {
        path: '/notification',
        name: 'Notification',
        component: () => import('@/views/dashboard/Notification'),
        meta: { title: 'menu.notification', keepAlive: true, permission: ['expert', 'teacher'] }
      },
      // teacher
      {
        path: '/teacher',
        name: 'teacher',
        redirect: '/teacher/main/my-content',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['expert', 'teacher'] },
        children: [
          {
            path: '/teacher/main',
            name: 'Main',
            redirect: '/teacher/main/my-content',
            component: () => import('@/views/teacher/Main'),
            meta: { title: 'menu.main', keepAlive: true, permission: ['expert', 'teacher'] },
            children: [
              {
                path: '/teacher/main/my-content',
                name: 'MyContent',
                component: () => import('@/views/teacher/MyContent'),
                meta: { title: 'menu.my-content', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/teacher/main/favorites',
                name: 'MyContent',
                component: () => import('@/views/teacher/Favorites'),
                meta: { title: 'menu.favorites', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/teacher/main/my-subscribes',
                name: 'MyContent',
                component: () => import('@/views/teacher/MySubscribes'),
                meta: { title: 'menu.my-subscribes', keepAlive: true, permission: ['expert', 'teacher'] }
              }
            ]
          },
          {
            path: '/teacher/library',
            name: 'Library',
            component: () => import('@/views/teacher/Library'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/my-class',
            name: 'MyClass',
            component: () => import('@/views/teacher/MyClass'),
            meta: { title: 'menu.my-class', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/add-task',
            name: 'AddTask',
            component: () => import('@/views/teacher/AddTask'),
            meta: { title: 'menu.add-task', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/add-assessment',
            name: 'AddAssessment',
            component: () => import('@/views/teacher/AddAssessment'),
            meta: { title: 'menu.add-assessment', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/add-instructional-content',
            name: 'AddInstructionalContent',
            component: () => import('@/views/teacher/AddInstructionalContent'),
            meta: { title: 'menu.add-instructional-content', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/add-unit-plan',
            name: 'AddUnitPlan',
            component: () => import('@/views/teacher/AddUnitPlan'),
            meta: { title: 'menu./teacher/add-unit-plan', keepAlive: true, permission: ['expert', 'teacher'] }
          }
        ]
      },

      // expert
      {
        path: '/expert',
        name: 'expert',
        redirect: '/expert/my-content',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['expert', 'teacher'] },
        children: [
          {
            path: '/expert/my-content',
            name: 'MyContent',
            component: () => import('@/views/expert/MyContent'),
            meta: { title: 'menu.my-content', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/expert/Library',
            name: 'Library',
            component: () => import('@/views/expert/Library'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/expert/add-topic',
            name: 'AddTopic',
            component: () => import('@/views/expert/AddTopic'),
            meta: { title: 'menu.my-content', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/expert/add-material',
            name: 'AddMaterial',
            component: () => import('@/views/expert/AddMaterial'),
            meta: { title: 'menu.add-material', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/expert/add-task',
            name: 'AddTask',
            component: () => import('@/views/expert/AddTask'),
            meta: { title: 'menu.add-task', keepAlive: true, permission: ['expert', 'teacher'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['expert', 'teacher'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['expert', 'teacher'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.profile', hidden: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['expert', 'teacher']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['expert', 'teacher']
                }
              }
            ]
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { hideChildrenInMenu: false, title: 'menu.exception', icon: 'warning', permission: ['expert', 'teacher'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['expert', 'teacher'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['expert', 'teacher'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['expert', 'teacher'] }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      },
      {
        path: 'auth-result',
        name: 'authResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/AuthResult')
      },
      {
        path: 'select-role',
        name: 'selectRole',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/SelectRole')
      },
      {
        path: 'add-preference',
        name: 'addPreference',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/AddPreference')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

/**
 * default teacher main router
 * @type {string}
 */
export const defaultTeacherRouter = '/teacher/main/my-content'

/**
 * default expert main router
 * @type {string}
 */
export const defaultExpertRouter = '/expert/my-content'

/**
 * select role router
 * @type {string}
 */
export const selectRoleRouter = '/user/select-role'

/**
 * add preference
 * @type {string}
 */
export const addPreferenceRouter = '/user/add-preference'
