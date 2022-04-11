// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout, AddOnLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import { USER_MODE, CurriculumType } from '@/const/common'

import CreatedByMeSvg from '@/assets/svgIcon/myContent/Created_by_me.svg?inline'
import DiscoverSvg from '@/assets/svgIcon/myContent/Discover.svg?inline'

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
        meta: { title: 'menu.notification', keepAlive: true, permission: ['teacher'] }
      },
      {
        path: '/notification-detail/:id',
        props: true,
        name: 'Notification Detail',
        component: () => import('@/views/dashboard/NotificationDetail'),
        meta: { title: 'menu.notification-detail', keepAlive: true, permission: ['teacher'] }
      },
      // teacher
      {
        path: '/teacher',
        name: 'teacher',
        redirect: '/teacher/main/created-by-me',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['teacher'] },
        children: [
          {
            path: '/teacher/main',
            name: 'Main',
            redirect: '/teacher/main/created-by-me',
            component: () => import('@/views/teacher/Main'),
            meta: { title: 'menu.main', keepAlive: true, permission: ['teacher'] },
            children: [
              {
                path: '/teacher/main/created-by-me',
                name: 'CreatedByMe',
                component: () => import('@/views/teacher/CreatedByMe'),
                meta: { title: 'menu.my-content', keepAlive: true, permission: ['teacher'], icon: CreatedByMeSvg }
              },
              {
                path: '/teacher/main/my-favorite',
                name: 'MyFavorite',
                component: () => import('@/views/teacher/MyFavorite'),
                meta: { title: 'menu.my-favorite', keepAlive: true, permission: ['teacher'], icon: DiscoverSvg }
              },
              // {
              //   path: '/teacher/main/my-classes/:classId',
              //   name: 'MyClassesTeacher',
              //   props: true,
              //   component: () => import('@/views/teacher/MyClasses'),
              //   meta: { title: 'menu.my-classes', keepAlive: true, permission: ['teacher'], icon: 'contacts', dynamicKey: 'currentClassList' }
              // },
              {
                path: '/teacher/main/shared',
                name: 'Shared',
                component: () => import('@/views/teacher/Shared'),
                meta: { title: 'menu.shared', keepAlive: true, permission: ['teacher'], hidden: true }
              },
              {
                path: '/teacher/main/discover',
                name: 'Discover',
                component: () => import('@/views/teacher/Discover'),
                meta: { title: 'menu.discover', keepAlive: true, permission: ['teacher'], hidden: true }
              },
              {
                path: '/teacher/main/subscribes',
                name: 'Subscribes',
                component: () => import('@/views/teacher/Subscribes'),
                meta: { title: 'menu.subscribes', keepAlive: true, permission: ['teacher'], hidden: true }
              },
              {
                path: '/teacher/main/popular',
                name: 'Popular',
                component: () => import('@/views/teacher/Popular'),
                meta: { title: 'menu.popular', keepAlive: true, permission: ['teacher'], hidden: true }
              }
            ]
          },
          {
            path: '/teacher/library/:browserType?/',
            name: 'Library',
            component: () => import('@/views/teacher/Library'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/library-v2/:browserType?/',
            name: 'LibraryV2',
            component: () => import('@/views/teacher/LibraryV2'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/managing',
            name: 'Managing',
            redirect: '/teacher/managing/school-user',
            component: () => import('@/views/teacher/Managing'),
            meta: { title: 'menu.managing', keepAlive: true, permission: ['teacher'], fullLayout: true },
            children: [
              // {
              //   path: '/teacher/managing/school-info',
              //   name: 'SchoolInfo',
              //   component: () => import('@/views/teacher/manage/SchoolInfo'),
              //   meta: { title: 'menu.managing.school-info', keepAlive: true, icon: 'home', permission: ['teacher'], mode: USER_MODE.SCHOOL }
              // },
              {
                path: '/teacher/managing/school-user',
                name: 'SchoolUser',
                component: () => import('@/views/teacher/manage/SchoolUser'),
                meta: { title: 'menu.managing.school-user', keepAlive: true, icon: 'user', permission: ['teacher'], mode: USER_MODE.SCHOOL }
              },
              // {
              //   path: '/teacher/managing/term',
              //   name: 'ManageTerm',
              //   component: () => import('@/views/teacher/manage/Term'),
              //   meta: { title: 'menu.managing.term', keepAlive: true, permission: ['teacher'] }
              // },
              {
                path: '/teacher/managing/academics',
                name: 'Academics',
                redirect: '/teacher/managing/planning-format',
                component: RouteView,
                meta: { title: 'menu.managing.academics', keepAlive: true, icon: 'schedule', permission: ['teacher'] },
                children: [
                  {
                    path: '/teacher/managing/tag-settings',
                    name: 'tagSettings',
                    component: () => import('@/views/teacher/manage/tags/TagSettingsList'),
                    meta: { title: 'menu.managing.tags-settings', keepAlive: true, permission: ['teacher'], mode: USER_MODE.SCHOOL }
                  },
                  {
                    path: '/teacher/managing/planning-format',
                    name: 'PlanningFormat',
                    component: () => import('@/views/teacher/manage/PlanningFormat/PlanningFormat'),
                    meta: { title: 'menu.managing.planning-format', keepAlive: true, permission: ['teacher'], mode: USER_MODE.SCHOOL }
                  },
                  {
                    path: '/teacher/managing/skill',
                    name: 'KnowledgeList',
                    component: () => import('@/views/teacher/manage/KnowledgeList'),
                    meta: { title: 'menu.managing.skill', keepAlive: true, permission: ['teacher'], curriculumType: CurriculumType.IBMYP, mode: USER_MODE.SCHOOL }
                  // },
                  // {
                  //   path: '/teacher/managing/academic',
                  //   name: 'AcademicList',
                  //   component: () => import('@/views/teacher/manage/AcademicList'),
                  //   meta: { title: 'menu.managing.academic', keepAlive: true, permission: ['teacher'] }
                  // },
                  // {
                  //   path: '/teacher/managing/circulum',
                  //   name: 'CirculumList',
                  //   component: () => import('@/views/teacher/manage/CirculumList'),
                  //   meta: { title: 'menu.managing.circulum', keepAlive: true, permission: ['teacher'] }
                  }
                ]
              },
              {
                path: '/teacher/managing/class',
                name: 'ManagingClass',
                component: () => import('@/views/teacher/manage/Class'),
                meta: { title: 'menu.managing.class', keepAlive: true, icon: 'desktop', permission: ['teacher'] }
              }
            ]
          },
          {
            path: '/teacher/managing/planning-format/task-preview',
            name: 'PlanningFormatTaskPreview',
            component: () => import('@/views/teacher/manage/PlanningFormat/TaskPreview'),
            meta: { title: 'menu.managing.task-preview', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/managing/planning-format/unit-plan-preview',
            name: 'PlanningFormatUnitPreview',
            component: () => import('@/views/teacher/manage/PlanningFormat/UnitPlanPreview'),
            meta: { title: 'menu.managing.plan-preview', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/my-class',
            name: 'MyClass',
            component: () => import('@/views/teacher/MyClass'),
            meta: { title: 'menu.my-class', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/add-task/:taskId?/:mode?', // mode:edit 编辑模式 pick-task-slide:选择slide创建task模式
            name: 'AddTask',
            props: true,
            component: () => import('@/views/teacher/AddTask'),
            meta: { title: 'menu.task', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/task-redirect/:taskId?/:parentId?',
            name: 'TaskRedirect',
            props: true,
            component: () => import('@/views/teacher/TaskRedirect'),
            meta: { title: 'menu.task', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/task-redirect-by-mode/:taskMode',
            name: 'TaskByModeRedirect',
            props: true,
            component: () => import('@/views/teacher/TaskRedirectByMode'),
            meta: { title: 'menu.task', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/add-evaluation/:evaluationId?/:mode?',
            name: 'AddEvaluation',
            props: true,
            component: () => import('@/views/teacher/AddEvaluation'),
            meta: { title: 'menu.evaluation', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/evaluation-redirect/:evaluationId?',
            name: 'EvaluationRedirect',
            props: true,
            component: () => import('@/views/teacher/EvaluationRedirect'),
            meta: { title: 'menu.evaluation', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/topics-from-experts',
            name: 'TopicsFromExperts',
            component: () => import('@/views/teacher/TopicsFromExperts'),
            meta: { title: 'menu.topics-from-experts', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/add-lesson/:lessonId?',
            name: 'AddLesson',
            props: true,
            component: () => import('@/views/teacher/AddLesson'),
            meta: { title: 'menu.lessons', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/lesson-redirect/:lessonId?',
            name: 'LessonRedirect',
            props: true,
            component: () => import('@/views/teacher/LessonRedirect'),
            meta: { title: 'menu.lessons', keepAlive: true, permission: ['teacher'] }
          },
          // {
          //   path: '/teacher/add-material/:materialId',
          //   props: true,
          //   name: 'AddMaterial',
          //   component: () => import('@/views/teacher/AddMaterial'),
          //   meta: { title: 'menu.add-material', keepAlive: true, permission: ['teacher'] }
          // },
          {
            path: '/teacher/unit-plan/:unitPlanId',
            props: true,
            name: 'UnitPlan',
            component: () => import('@/views/teacher/AddUnitPlan'),
            meta: { title: 'menu.teacher.add-unit-plan', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/unit-plan-redirect/:unitPlanId',
            props: true,
            name: 'UnitPlanRedirect',
            component: () => import('@/views/teacher/UnitPlanRedirect'),
            meta: { title: 'menu.teacher.unit-plan', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/class-evaluation/:taskId/:classId/:sessionId/:mode?',
            name: 'ClassEvaluation',
            props: true,
            component: () => import('@/views/teacher/ClassSessionEvaluation'),
            meta: { title: 'Session evaluate', keepAlive: true, permission: ['teacher'] }
          },
          // {
          //   path: '/teacher/unit-plan-material-redirect/:unitPlanId/:materialId',
          //   name: 'MaterialRedirect',
          //   props: true,
          //   component: () => import('@/views/teacher/MaterialRedirect'),
          //   meta: { title: 'menu.teacher.material', keepAlive: true, permission: ['teacher'] }
          // },
          // {
          //   path: '/teacher/unit-plan-material/:unitPlanId/:materialId',
          //   props: true,
          //   name: 'UnitPlanMaterial',
          //   component: () => import('@/views/teacher/AddUnitPlanMaterial'),
          //   meta: { title: 'menu.teacher.unit-plan-material', keepAlive: true, permission: ['teacher'] }
          // },
          {
            path: '/teacher/buy',
            name: 'TeacherBuyMain',
            redirect: '/teacher/buy/purchases',
            component: RouteView, // () => import('@/views/teacher/OrderMain'),
            meta: { title: 'menu.buy', keepAlive: true, permission: ['teacher'], fullLayout: true },
            children: [
              {
                path: '/teacher/buy/purchases',
                name: 'TeacherBuyPurchases',
                component: () => import('@/views/teacher/buy/Purchases'),
                meta: { title: 'menu.buy.purchase', keepAlive: true, icon: 'money-collect', permission: ['teacher'] }
              }
            ]
          },
          {
            path: '/teacher/sell',
            name: 'TeacherSellMain',
            redirect: '/teacher/sell/dashboard',
            component: RouteView, // () => import('@/views/teacher/OrderMain'),
            meta: { title: 'menu.sell', keepAlive: true, permission: ['teacher'], fullLayout: true },
            children: [
              {
                path: '/teacher/sell/dashboard',
                name: 'TeacherSellDashboard',
                component: () => import('@/views/teacher/sell/Dashboard'),
                meta: { title: 'menu.sell.dashboard', keepAlive: true, icon: 'money-collect', permission: ['teacher'] }
              },
              {
                path: '/teacher/sell/inspiration-teacher',
                name: 'TeacherSellInspirationTeacher',
                component: () => import('@/views/teacher/sell/InspirationTeacher'),
                meta: { title: 'menu.sell.inspiration-teacher', keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
              },
              {
                path: '/teacher/sell/inspiration-student',
                name: 'TeacherSellInspirationStudent',
                component: () => import('@/views/teacher/sell/InspirationStudent'),
                meta: { title: 'menu.sell.inspiration-student', keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
              },
              {
                path: '/teacher/sell/statistics',
                name: 'TeacherSellStatistics',
                component: () => import('@/views/teacher/sell/Statistics'),
                meta: { title: 'menu.sell.statistics', keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
              }
              // {
              //   path: '/teacher/sell/followers',
              //   name: 'TeacherSellFollowers',
              //   component: () => import('@/views/teacher/sell/Followers'),
              //   meta: { title: 'menu.sell.followers', keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
              // }
            ]
          }
        ]
      },

      // expert
      {
        path: '/expert',
        name: 'expert',
        redirect: '/expert/created-by-me',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['teacher'] },
        children: [
          {
            path: '/expert/main',
            name: 'Main',
            redirect: '/expert/main/created-by-me',
            component: () => import('@/views/expert/Main'),
            meta: { title: 'menu.main', keepAlive: true, permission: ['teacher'] },
            children: [
              {
                path: '/expert/main/created-by-me',
                name: 'ExpertCreatedByMe',
                component: () => import('@/views/teacher/CreatedByMe'),
                meta: { title: 'menu.my-content', keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/expert/main/my-favorite',
                name: 'ExpertMyFavorite',
                component: () => import('@/views/teacher/MyFavorite'),
                meta: { title: 'menu.my-favorite', keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/expert/main/shared',
                name: 'ExpertShared',
                component: () => import('@/views/teacher/Shared'),
                meta: { title: 'menu.shared', keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/expert/main/discover',
                name: 'ExpertDiscover',
                component: () => import('@/views/teacher/Discover'),
                meta: { title: 'menu.discover', keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/expert/main/subscribes',
                name: 'ExpertSubscribes',
                component: () => import('@/views/teacher/Subscribes'),
                meta: { title: 'menu.subscribes', keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/expert/main/popular',
                name: 'ExpertPopular',
                component: () => import('@/views/teacher/Popular'),
                meta: { title: 'menu.popular', keepAlive: true, permission: ['teacher'] }
              }
            ]
          },
          {
            path: '/expert/library/:browserType?/',
            name: 'Library',
            component: () => import('@/views/teacher/Library'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/expert/topic/:topicId',
            props: true,
            name: 'AddTopic',
            component: () => import('@/views/expert/AddTopic'),
            meta: { title: 'menu.topics-from-experts', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/expert/topic-redirect/:topicId',
            props: true,
            name: 'TopicRedirect',
            component: () => import('@/views/expert/TopicRedirect'),
            meta: { title: 'menu.teacher.unit-plan', keepAlive: true, permission: ['teacher'] }
          }
        ]
      },

      // student
      {
        path: '/student',
        name: 'student',
        redirect: '/student/main',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['student'] },
        children: [
          {
            path: '/student/main',
            name: 'Main',
            redirect: '/student/main/my-task',
            component: () => import('@/views/student/Main'),
            meta: { title: 'menu.main', keepAlive: true, permission: ['student'] },
            children: [
              {
                path: '/student/main/my-task',
                name: 'MyTask',
                component: () => import('@/views/student/MyTask'),
                meta: { title: 'menu.my-task', keepAlive: true, permission: ['student'], icon: CreatedByMeSvg }
              },
              {
                path: '/student/main/my-favorite',
                name: 'MyFavorite',
                component: () => import('@/views/student/MyFavorite'),
                meta: { title: 'menu.my-favorite', keepAlive: true, permission: ['student'], icon: DiscoverSvg, mode: USER_MODE.SELF }
              },
              {
                path: '/student/main/my-orders',
                name: 'MyOrders',
                component: () => import('@/views/student/MyOrders'),
                meta: { title: 'menu.my-orders', keepAlive: true, permission: ['student'], icon: 'account-book', mode: USER_MODE.SELF }
              },
              {
                path: '/student/main/my-schedule',
                name: 'MySchedule',
                component: () => import('@/views/student/MySchedule'),
                meta: { title: 'menu.my-schedule', keepAlive: true, permission: ['student'], icon: 'schedule', mode: USER_MODE.SCHOOL }
              },
              {
                path: '/student/main/my-classes/:classId',
                name: 'MyClasses',
                props: true,
                component: () => import('@/views/student/MyClasses'),
                meta: { title: 'menu.my-classes', keepAlive: true, permission: ['student'], icon: 'contacts', mode: USER_MODE.SCHOOL, dynamicKey: 'currentClassList' }
              }
            ]
          },
          {
            path: '/student/library-v2/:browserType?/',
            name: 'StudentLibraryV2',
            component: () => import('@/views/student/LibraryV2'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['student'], fullLayout: true, mode: USER_MODE.SELF }
          },
          {
            path: '/student/evaluation/:sessionId',
            props: true,
            name: 'StudentEvaluation',
            component: () => import('@/views/student/StudentEvaluation'),
            meta: { title: 'Student Evaluation', keepAlive: true, permission: ['student'] }
          },
          {
            path: '/student/peer-evaluation/:sessionId',
            props: true,
            name: 'PeerEvaluation',
            component: () => import('@/views/student/PeerEvaluation'),
            meta: { title: 'Peer Evaluation', keepAlive: true, permission: ['student'] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['teacher', 'student'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true, permission: ['teacher', 'student'] }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['teacher', 'student'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: { title: 'account.settings.menuMap.profile', hidden: true, permission: ['teacher', 'student'] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['teacher', 'student']
                }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: 'account.settings.menuMap.custom', hidden: true, keepAlive: true, permission: ['teacher', 'student'] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: 'account.settings.menuMap.binding', hidden: true, keepAlive: true, permission: ['teacher', 'student'] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: {
                  title: 'account.settings.menuMap.notification',
                  hidden: true,
                  keepAlive: true,
                  permission: ['teacher', 'student']
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
        meta: { hideChildrenInMenu: false, title: 'menu.exception', icon: 'warning', permission: ['teacher'] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['teacher'] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['teacher'] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['teacher'] }
          }
        ]
      }
    ]
  },

  {
    path: '*',
    redirect: '/',
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
               path: 'resetPassword',
               name: 'resetPassword',
               component: () => import(/* webpackChunkName: "resetPassword" */ '@/views/user/ResetPassword')
             },
             {
               path: 'invite',
               name: 'invite',
               component: () => import(/* webpackChunkName: "invite" */ '@/views/user/Invite')
             },
             {
               path: 'register-result',
               name: 'registerResult',
               component: () => import(/* webpackChunkName: "registerResult" */ '@/views/user/RegisterResult')
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
             },
             {
               path: 'auth-redirect',
               name: 'authRedirect',
               component: () => import(/* webpackChunkName: "authRedirect" */ '@/views/user/AuthRedirect')
             }
           ]
         },
         {
           path: '/user/auth-result',
           name: 'authResult',
           component: () => import(/* webpackChunkName: "authResult" */ '@/views/user/AuthResult'),
           props: true
         },
         {
           path: '/collaborate/:code',
           name: 'CollaborateJoin',
           props: true,
           meta: { title: 'Collaborate invite', keepAlive: true, icon: bxAnaalyse, permission: ['teacher'] },
           component: () => import(/* webpackChunkName: "fail" */ '@/views/collaborate/Join')
         },
         {
           path: '/linkValid',
           name: 'linkValid',
           props: true,
           meta: { title: 'Collaborate invite', keepAlive: true, icon: bxAnaalyse, permission: ['teacher'] },
           component: () => import(/* webpackChunkName: "fail" */ '@/views/collaborate/LinkValid')
         },
         // addon
         {
           path: '/addon',
           name: 'addon',
           component: BlankLayout,
           children: [
             {
               path: '/addon/callback',
               name: 'addonCallback',
               props: true,
               component: () => import(/* webpackChunkName: "fail" */ '@/views/addon/AddonCallback'),
               meta: { title: 'Redirectt', keepAlive: true }
             },
             {
               path: '/addon/pageRedirect/:sourceType?/:id',
               name: 'pageRedirect',
               props: true,
               component: () => import(/* webpackChunkName: "fail" */ '@/views/addon/PageRedirect')
             },
             {
               path: '/addon/classGoBack',
               name: 'classGoBack',
               props: true,
               component: () => import(/* webpackChunkName: "fail" */ '@/views/addon/ClassGoBack'),
               meta: { title: 'Back', keepAlive: true }
             }
           ]
         },
         // addon iframe 引用组件
         {
           path: '/addon-iframe',
           name: 'addon-iframe',
           component: AddOnLayout,
           children: [
             {
               path: '/addon-iframe/task-library/:taskId',
               name: 'TaskLibrary',
               props: true,
               component: () => import(/* webpackChunkName: "TaskLibrary" */ '@/views/addon/TaskLibrary'),
               meta: { title: 'Task Library', keepAlive: true }
             },
             {
               path: '/addon-iframe/tip/:slideId/:pageId',
               name: 'Tip',
               props: true,
               component: () => import(/* webpackChunkName: "Tip" */ '@/views/addon/Tip'),
               meta: { title: 'Tip', keepAlive: true }
             }
           ]
         },
         // share
         {
           path: '/share',
           name: 'share',
           component: BlankLayout,
           meta: { title: 'Share', keepAlive: true },
           children: [
             {
               path: '/share/:code',
               name: 'shareDetail',
               props: true,
               component: () => import('@/views/share/ShareDetail'),
               meta: { title: 'Share', keepAlive: true }
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
export const defaultTeacherRouter = '/teacher/main/created-by-me'

/**
 * default expert main router
 * @type {string}
 */
// export const defaultExpertRouter = '/expert/main/created-by-me'
export const defaultExpertRouter = '/teacher/main/created-by-me'

export const defaultStudentRouter = '/student/main/my-task'

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
