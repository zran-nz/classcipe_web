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
      {
        path: '/notification-detail/:id',
        props: true,
        name: 'Notification Detail',
        component: () => import('@/views/dashboard/NotificationDetail'),
        meta: { title: 'menu.notification-detail', keepAlive: true, permission: ['expert', 'teacher'] }
      },
      // teacher
      {
        path: '/teacher',
        name: 'teacher',
        redirect: '/teacher/main/created-by-me',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['expert', 'teacher'] },
        children: [
          {
            path: '/teacher/main',
            name: 'Main',
            redirect: '/teacher/main/created-by-me',
            component: () => import('@/views/teacher/Main'),
            meta: { title: 'menu.main', keepAlive: true, permission: ['expert', 'teacher'] },
            children: [
              {
                path: '/teacher/main/created-by-me',
                name: 'CreatedByMe',
                component: () => import('@/views/teacher/CreatedByMe'),
                meta: { title: 'menu.my-content', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/teacher/main/my-favorite',
                name: 'MyFavorite',
                component: () => import('@/views/teacher/MyFavorite'),
                meta: { title: 'menu.my-favorite', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/teacher/main/shared',
                name: 'Shared',
                component: () => import('@/views/teacher/Shared'),
                meta: { title: 'menu.shared', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/teacher/main/discover',
                name: 'Discover',
                component: () => import('@/views/teacher/Discover'),
                meta: { title: 'menu.discover', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/teacher/main/subscribes',
                name: 'Subscribes',
                component: () => import('@/views/teacher/Subscribes'),
                meta: { title: 'menu.subscribes', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/teacher/main/popular',
                name: 'Popular',
                component: () => import('@/views/teacher/Popular'),
                meta: { title: 'menu.popular', keepAlive: true, permission: ['expert', 'teacher'] }
              }
            ]
          },
          {
            path: '/teacher/library/:browserType?/',
            name: 'Library',
            component: () => import('@/views/teacher/Library'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['expert', 'teacher'], fullLayout: true }
          },
          {
            path: '/teacher/my-class',
            name: 'MyClass',
            component: () => import('@/views/teacher/MyClass'),
            meta: { title: 'menu.my-class', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/add-task/:taskId?/:mode?', // mode:edit 编辑模式 pick-task-slide:选择slide创建task模式
            name: 'AddTask',
            props: true,
            component: () => import('@/views/teacher/AddTask'),
            meta: { title: 'menu.task', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/task-redirect/:taskId?/:parentId?',
            name: 'TaskRedirect',
            props: true,
            component: () => import('@/views/teacher/TaskRedirect'),
            meta: { title: 'menu.task', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/add-evaluation/:evaluationId?/:mode?',
            name: 'AddEvaluation',
            props: true,
            component: () => import('@/views/teacher/AddEvaluation'),
            meta: { title: 'menu.evaluation', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/start-evaluation/:evaluationId/:classId',
            name: 'StartEvaluation',
            props: true,
            component: () => import('@/views/teacher/StartEvaluation'),
            meta: { title: 'menu.evaluation', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/evaluation-redirect/:evaluationId?',
            name: 'EvaluationRedirect',
            props: true,
            component: () => import('@/views/teacher/EvaluationRedirect'),
            meta: { title: 'menu.evaluation', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/topics-from-experts',
            name: 'TopicsFromExperts',
            component: () => import('@/views/teacher/TopicsFromExperts'),
            meta: { title: 'menu.topics-from-experts', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/add-lesson/:lessonId?',
            name: 'AddLesson',
            props: true,
            component: () => import('@/views/teacher/AddLesson'),
            meta: { title: 'menu.lessons', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/lesson-redirect/:lessonId?',
            name: 'LessonRedirect',
            props: true,
            component: () => import('@/views/teacher/LessonRedirect'),
            meta: { title: 'menu.lessons', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          // {
          //   path: '/teacher/add-material/:materialId',
          //   props: true,
          //   name: 'AddMaterial',
          //   component: () => import('@/views/teacher/AddMaterial'),
          //   meta: { title: 'menu.add-material', keepAlive: true, permission: ['expert', 'teacher'] }
          // },
          {
            path: '/teacher/unit-plan/:unitPlanId',
            props: true,
            name: 'UnitPlan',
            component: () => import('@/views/teacher/AddUnitPlan'),
            meta: { title: 'menu.teacher.add-unit-plan', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/unit-plan-redirect/:unitPlanId',
            props: true,
            name: 'UnitPlanRedirect',
            component: () => import('@/views/teacher/UnitPlanRedirect'),
            meta: { title: 'menu.teacher.unit-plan', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/teacher/class-evaluation/:taskId/:classId',
            name: 'ClassEvaluation',
            props: true,
            component: () => import('@/views/teacher/ClassSessionEvaluation'),
            meta: { title: 'menu.evaluation', keepAlive: true, permission: ['expert', 'teacher'] }
          }
          // {
          //   path: '/teacher/unit-plan-material-redirect/:unitPlanId/:materialId',
          //   name: 'MaterialRedirect',
          //   props: true,
          //   component: () => import('@/views/teacher/MaterialRedirect'),
          //   meta: { title: 'menu.teacher.material', keepAlive: true, permission: ['expert', 'teacher'] }
          // },
          // {
          //   path: '/teacher/unit-plan-material/:unitPlanId/:materialId',
          //   props: true,
          //   name: 'UnitPlanMaterial',
          //   component: () => import('@/views/teacher/AddUnitPlanMaterial'),
          //   meta: { title: 'menu.teacher.unit-plan-material', keepAlive: true, permission: ['expert', 'teacher'] }
          // }
        ]
      },

      // expert
      {
        path: '/expert',
        name: 'expert',
        redirect: '/expert/created-by-me',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['expert', 'teacher'] },
        children: [
          {
            path: '/expert/main',
            name: 'Main',
            redirect: '/expert/main/created-by-me',
            component: () => import('@/views/expert/Main'),
            meta: { title: 'menu.main', keepAlive: true, permission: ['expert', 'teacher'] },
            children: [
              {
                path: '/expert/main/created-by-me',
                name: 'CreatedByMe',
                component: () => import('@/views/expert/CreatedByMe'),
                meta: { title: 'menu.my-content', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/expert/main/my-favorite',
                name: 'MyFavorite',
                component: () => import('@/views/expert/MyFavorite'),
                meta: { title: 'menu.my-favorite', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/expert/main/shared',
                name: 'Shared',
                component: () => import('@/views/teacher/Shared'),
                meta: { title: 'menu.shared', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/expert/main/discover',
                name: 'Discover',
                component: () => import('@/views/teacher/Discover'),
                meta: { title: 'menu.discover', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/expert/main/subscribes',
                name: 'Subscribes',
                component: () => import('@/views/teacher/Subscribes'),
                meta: { title: 'menu.subscribes', keepAlive: true, permission: ['expert', 'teacher'] }
              },
              {
                path: '/expert/main/popular',
                name: 'Popular',
                component: () => import('@/views/teacher/Popular'),
                meta: { title: 'menu.popular', keepAlive: true, permission: ['expert', 'teacher'] }
              }
            ]
          },
          {
            path: '/expert/library/:browserType?/',
            name: 'Library',
            component: () => import('@/views/teacher/Library'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/expert/topic/:topicId',
            props: true,
            name: 'AddTopic',
            component: () => import('@/views/expert/AddTopic'),
            meta: { title: 'menu.topics-from-experts', keepAlive: true, permission: ['expert', 'teacher'] }
          },
          {
            path: '/expert/topic-redirect/:topicId',
            props: true,
            name: 'TopicRedirect',
            component: () => import('@/views/expert/TopicRedirect'),
            meta: { title: 'menu.teacher.unit-plan', keepAlive: true, permission: ['expert', 'teacher'] }
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
        component: () => import(/* webpackChunkName: "login" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "registerResult" */ '@/views/user/RegisterResult')
      },
      {
        path: 'auth-result',
        name: 'authResult',
        component: () => import(/* webpackChunkName: "authResult" */ '@/views/user/AuthResult')
      },
      {
        path: 'select-role',
        name: 'selectRole',
        component: () => import(/* webpackChunkName: "selectRole" */ '@/views/user/SelectRole')
      },
      {
        path: 'add-preference',
        name: 'addPreference',
        component: () => import(/* webpackChunkName: "addPreference" */ '@/views/user/AddPreference')
      },
      {
        path: 'auth-check',
        name: 'authCheck',
        component: () => import(/* webpackChunkName: "authCheck" */ '@/views/user/AuthCheck')
      }
    ]
  },
  {
    path: '/addon/preview/:sourceType?/:id',
    name: 'AddonPreview',
    props: true,
    component: () => import(/* webpackChunkName: "fail" */ '@/views/addon/preview')
  },
  {
    path: '/addon/pageRedirect/:sourceType?/:id',
    name: 'PageRedirect',
    props: true,
    component: () => import(/* webpackChunkName: "fail" */ '@/views/addon/PageRedirect')
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
export const defaultTeacherRouter = '/teacher/main/created-by-me'

/**
 * default expert main router
 * @type {string}
 */
export const defaultExpertRouter = '/expert/main/created-by-me'

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
