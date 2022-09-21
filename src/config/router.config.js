// eslint-disable-next-line
import { BasicLayout, BlankLayout, IframeLayout, UserLayout, H5Layout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import { CurriculumType, USER_MODE } from '@/const/common'

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
        meta: { title: 'menu.notification', keepAlive: false, permission: ['teacher'] }
      },
      {
        path: '/notification-detail/:id',
        props: true,
        name: 'Notification Detail',
        component: () => import('@/views/dashboard/NotificationDetail'),
        meta: { title: 'menu.notification-detail', keepAlive: false, permission: ['teacher'] }
      },
      // teacher
      {
        path: '/teacher',
        name: 'teacher',
        redirect: '/teacher/main/created-by-me',
        component: RouteView,
        meta: { title: 'menu.main', keepAlive: true, icon: bxAnaalyse, permission: ['teacher', 'common'] },
        children: [
          {
            path: '/teacher/main/created-by-me',
            name: 'CreatedByMe',
            component: () => import('@/views/teacher/CreatedByMeV2'),
            meta: { title: 'menu.my-content', keepAlive: true, permission: ['teacher'], icon: CreatedByMeSvg }
          },
          {
            path: '/teacher/main/created-by-me-old',
            name: 'CreatedByMeOld',
            component: () => import('@/views/teacher/CreatedByMe'),
            meta: { title: 'menu.my-content', keepAlive: true, permission: ['teacher'], icon: CreatedByMeSvg }
          },
          {
            path: '/teacher/main/my-published',
            name: 'MyPublished',
            component: () => import('@/views/teacher/MyPublished'),
            meta: { title: 'menu.my-published', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/main/my-favorite',
            name: 'MyFavorite',
            component: () => import('@/views/teacher/MyFavorite'),
            meta: { title: 'menu.my-favorite', keepAlive: true, permission: ['teacher'], icon: DiscoverSvg }
          },
          {
            path: '/teacher/main/shared',
            name: 'Shared',
            component: () => import('@/views/teacher/Shared'),
            meta: { title: 'menu.shared', keepAlive: true, permission: ['teacher'], hidden: true }
          },
          {
            path: '/teacher/library/search/:keyword',
            name: 'LibrarySearch',
            component: () => import('@/views/teacher/LibrarySearch'),
            props: true,
            meta: { title: 'menu.librarySearch', owner: '/teacher/library', keepAlive: false, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/library',
            name: 'Library',
            component: () => import('@/views/teacher/Library'),
            meta: { title: 'menu.library', keepAlive: true, permission: ['teacher'], fullLayout: true, hiddenFooter: true }
          },
          {
            path: '/teacher/library-all/:category',
            name: 'LibraryAll',
            props: true,
            component: () => import('@/views/teacher/LibraryAll'),
            meta: { title: 'menu.library', owner: '/teacher/library', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/library-view/:contentType/:contentId',
            name: 'LibraryView',
            props: true,
            component: () => import('@/views/teacher/LibraryView'),
            meta: { title: 'menu.library', owner: '/teacher/library', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/resource-view/:contentType/:contentId',
            name: 'ResourceView',
            props: true,
            component: () => import('@/views/teacher/LibraryView'),
            meta: { title: 'menu.resourceSearch', owner: '/teacher/resource', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/resource/search/:keyword',
            name: 'ResourceSearch',
            component: () => import('@/views/teacher/ResourceSearch'),
            props: true,
            meta: { title: 'menu.resourceSearch', owner: '/teacher/resource', keepAlive: true, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/resource',
            name: 'Resource',
            component: () => import('@/views/teacher/Resource'),
            meta: { title: 'menu.resource', keepAlive: true, permission: ['teacher'], fullLayout: true, hiddenFooter: true }
          },
          {
            path: '/teacher/resource-all/:category',
            name: 'ResourceAll',
            props: true,
            component: () => import('@/views/teacher/ResourceAll'),
            meta: { title: 'menu.resource', owner: '/teacher/resource', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/main/live-workshops',
            name: 'LiveWorkshops',
            component: () => import('@/views/teacher/LiveWorkShops'),
            meta: { title: 'menu.live-workshops', keepAlive: true, permission: ['common'], icon: DiscoverSvg }
          },
          {
            path: '/teacher/main/calendar',
            name: 'Calendar',
            component: () => import('@/views/teacher/Calendar'),
            meta: { title: 'Calendar', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/managing',
            name: 'Managing',
            redirect: '/teacher/managing/school-user',
            component: () => import('@/views/teacher/Managing'),
            meta: { title: 'menu.managing', keepAlive: true, permission: ['teacher'], fullLayout: true },
            children: [
              {
                path: '/teacher/managing/school-info',
                name: 'SchoolInfo',
                component: () => import('@/views/teacher/manage/SchoolInfo'),
                meta: {
                  title: 'menu.managing.school-info',
                  keepAlive: true,
                  icon: 'home',
                  permission: ['teacher'],
                  mode: USER_MODE.SCHOOL
                }
              },
              {
                path: '/teacher/managing/school-user',
                name: 'SchoolUser',
                component: () => import('@/views/teacher/manage/SchoolUser'),
                meta: {
                  title: 'menu.managing.school-user',
                  keepAlive: true,
                  icon: 'user',
                  permission: ['teacher'],
                  mode: USER_MODE.SCHOOL
                }
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
                    meta: {
                      title: 'menu.managing.tags-settings',
                      keepAlive: true,
                      permission: ['teacher'],
                      mode: USER_MODE.SCHOOL
                    }
                  },
                  {
                    path: '/teacher/managing/planning-format',
                    name: 'PlanningFormat',
                    component: () => import('@/views/teacher/manage/PlanningFormat/PlanningFormat'),
                    meta: {
                      title: 'menu.managing.planning-format',
                      keepAlive: true,
                      permission: ['teacher'],
                      mode: USER_MODE.SCHOOL
                    }
                  },
                  {
                    path: '/teacher/managing/skill',
                    name: 'KnowledgeList',
                    component: () => import('@/views/teacher/manage/KnowledgeList'),
                    meta: {
                      title: 'menu.managing.skill',
                      keepAlive: true,
                      permission: ['teacher'],
                      curriculumType: CurriculumType.IBMYP,
                      mode: USER_MODE.SCHOOL
                    }
                  }
                  // {
                  //   path: '/teacher/managing/academic',
                  //   name: 'AcademicList',
                  //   component: () => import('@/views/teacher/manage/AcademicList'),
                  //   meta: { title: 'menu.managing.academic', keepAlive: true, permission: ['teacher'], mode: USER_MODE.SCHOOL }
                  // },
                  // {
                  //   path: '/teacher/managing/curriculum',
                  //   name: 'CirculumList',
                  //   component: () => import('@/views/teacher/manage/CirculumList'),
                  //   meta: { title: 'menu.managing.curriculum', keepAlive: true, permission: ['teacher'], mode: USER_MODE.SCHOOL }
                  // }
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
            meta: { title: 'menu.task', noSidebar: true, owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/add-task-v2/:taskId?/:mode?', // mode:edit 编辑模式 pick-task-slide:选择slide创建task模式
            name: 'AddTaskV2',
            props: true,
            component: () => import('@/views/teacher/AddTaskV2'),
            meta: { title: 'menu.task', noSidebar: true, owner: '/teacher/main/created-by-me', keepAlive: false, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/sub-task/:taskId',
            name: 'MySubtask',
            props: true,
            component: () => import('@/views/teacher/MySubtaskList'),
            meta: { title: 'menu.sub-task', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/link-content-list/:contentType/:contentId',
            name: 'Linked Content',
            props: true,
            component: () => import('@/views/teacher/LinkedContentList'),
            meta: { title: 'menu.linked-content', keepAlive: true, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/split-task/:parentTaskId',
            name: 'SplitTask',
            props: true,
            component: () => import('@/views/teacher/SplitTaskV2'),
            meta: { title: 'menu.splitTask', noSidebar: true, owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/task-redirect/:taskId?/:parentId?',
            name: 'TaskRedirect',
            props: true,
            component: () => import('@/views/teacher/TaskRedirect'),
            meta: { title: 'menu.task', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/task-redirect-by-mode/:taskMode',
            name: 'TaskByModeRedirect',
            props: true,
            component: () => import('@/views/teacher/TaskRedirectByMode'),
            meta: { title: 'menu.task', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/pd-content-redirect/:pdId?/:parentId?',
            name: 'PDContentRedirect',
            props: true,
            component: () => import('@/views/teacher/PDContentRedirect'),
            meta: { title: 'menu.pd', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'], fullLayout: true }
          },
          {
            path: '/teacher/pd-content/:pdId',
            name: 'AddPD',
            props: true,
            component: () => import('@/views/teacher/AddPD'),
            meta: { title: 'menu.pd', noSidebar: true, owner: '/teacher/main/created-by-me', keepAlive: false, permission: ['teacher'] }
          },
          {
            path: '/teacher/video-redirect/:videoId',
            name: 'VideoRedirect',
            props: true,
            component: () => import('@/views/teacher/VideoRedirect'),
            meta: { title: 'menu.pd', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/video/:videoId',
            name: 'AddVideo',
            props: true,
            component: () => import('@/views/teacher/AddVideo'),
            meta: { title: 'menu.video', noSidebar: true, owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/unit-plan/:unitPlanId',
            props: true,
            name: 'UnitPlan',
            component: () => import('@/views/teacher/AddUnitPlan'),
            meta: { title: 'menu.teacher.add-unit-plan', noSidebar: true, owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/unit-plan-v2/:unitPlanId',
            props: true,
            name: 'UnitPlanV2',
            component: () => import('@/views/teacher/AddUnitPlanV2'),
            meta: { title: 'menu.teacher.add-unit-plan', noSidebar: true, owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'], fullLayout: true, allowHiddenHeader: true, hiddenFooter: true }
          },
          {
            path: '/teacher/unit-plan-redirect/:unitPlanId',
            props: true,
            name: 'UnitPlanRedirect',
            component: () => import('@/views/teacher/UnitPlanRedirect'),
            meta: { title: 'menu.teacher.unit-plan', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/class-evaluation/:taskId/:classId/:sessionId/:mode?',
            name: 'ClassEvaluation',
            props: true,
            component: () => import('@/views/teacher/ClassSessionEvaluation'),
            meta: { title: 'Session evaluate', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/schedule-session/:id/:type',
            name: 'ScheduleSession',
            props(route) {
              const props = { ...route.params }
              props.type = +props.type // convert string to number
              return props
            },
            component: () => import('@/views/teacher/schedule/ScheduleSession'),
            meta: { title: 'Schedule', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/schedule-workshop/:id/:type',
            name: 'ScheduleWorkshop',
            props(route) {
              const props = { ...route.params }
              props.type = +props.type // convert string to number
              return props
            },
            component: () => import('@/views/teacher/AddLiveWorkshop'),
            meta: { title: 'Schedule Workshop', owner: '/teacher/main/created-by-me', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/class-session/:classId?',
            name: 'ClassSession',
            props: true,
            component: () => import('@/views/teacher/ClassSession'),
            meta: { title: 'Class', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/content-select/:type',
            name: 'TaskContentSelect',
            props(route) {
              const props = { ...route.params }
              props.type = +props.type // convert string to number
              return props
            },
            component: () => import('@/views/teacher/TaskContentSelect'),
            meta: { title: 'TaskContentSelect', owner: '/teacher/main/live-workshops', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/live-workshop/:id/:type',
            name: 'AddLiveWorkshop',
            props(route) {
              const props = { ...route.params }
              props.type = +props.type // convert string to number
              return props
            },
            component: () => import('@/views/teacher/AddLiveWorkshop'),
            meta: { title: 'AddLiveWorkshop', owner: '/teacher/main/live-workshops', keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/teacher/session-import/:type/:classId?',
            name: 'SessionImport',
            props(route) {
              const props = { ...route.params }
              const query = { ...route.query }
              props.type = +props.type // convert string to number
              if (query && query.startDate) {
                props.startDate = query.startDate
              }
              if (query && query.endDate) {
                props.endDate = query.endDate
              }
              if (query && query.searchType) {
                props.searchType = query.searchType
              }
              if (query && query.source) {
                props.source = query.source
              }
              return props
            },
            component: () => import('@/views/teacher/SessionImport'),
            meta: { title: 'SessionImport', owner: '/teacher/main/calendar', keepAlive: true, permission: ['teacher'] }
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
            name: 'StudentMain',
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
                meta: {
                  title: 'menu.my-favorite',
                  keepAlive: true,
                  permission: ['student'],
                  icon: DiscoverSvg,
                  mode: USER_MODE.SELF
                }
              },
              {
                path: '/student/main/my-orders',
                name: 'MyOrders',
                component: () => import('@/views/student/MyOrders'),
                meta: {
                  title: 'menu.my-orders',
                  keepAlive: true,
                  permission: ['student'],
                  icon: 'account-book',
                  mode: USER_MODE.SELF
                }
              },
              {
                path: '/student/main/my-schedule',
                name: 'MySchedule',
                component: () => import('@/views/student/MySchedule'),
                meta: {
                  title: 'menu.my-schedule',
                  keepAlive: true,
                  permission: ['student'],
                  icon: 'schedule',
                  mode: USER_MODE.SCHOOL
                }
              },
              {
                path: '/student/main/my-classes/:classId',
                name: 'MyClasses',
                props: true,
                component: () => import('@/views/student/MyClasses'),
                meta: {
                  title: 'menu.my-classes',
                  keepAlive: true,
                  permission: ['student'],
                  icon: 'contacts',
                  mode: USER_MODE.SCHOOL,
                  dynamicKey: 'currentClassList'
                }
              }
            ]
          },
          {
            path: '/student/library-v2/:browserType?/',
            name: 'StudentLibraryV2',
            component: () => import('@/views/student/LibraryV2'),
            meta: {
              title: 'menu.library',
              keepAlive: true,
              permission: ['student'],
              fullLayout: true,
              mode: USER_MODE.SELF
            }
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
        redirect: '/account/info',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['teacher', 'student'] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center'),
            meta: { title: 'menu.account.center', keepAlive: true, permission: ['teacher'] }
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
                meta: {
                  title: 'account.settings.menuMap.custom',
                  hidden: true,
                  keepAlive: true,
                  permission: ['teacher', 'student']
                }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: {
                  title: 'account.settings.menuMap.binding',
                  hidden: true,
                  keepAlive: true,
                  permission: ['teacher', 'student']
                }
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
          },
          {
            path: '/account/info',
            name: 'info',
            component: () => import('@/views/account/info'),
            meta: { title: 'menu.account.center', noSidebar: true, keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/account/logout',
            name: 'info',
            component: () => import('@/views/account/logout'),
            meta: { title: 'menu.account.logout', noSidebar: true, keepAlive: true, permission: ['student'] }
          }
        ]
      },

      // manage
      {
        path: '/manage',
        component: RouteView,
        redirect: '/manage/school-info',
        name: 'manage',
        meta: { title: 'menu.managing', keepAlive: true, permission: ['teacher'], fullLayout: true },
        children: [
          {
            path: '/manage/school-info',
            name: 'SchoolInfo',
            component: () => import('@/views/account/manage/SchoolInfo'),
            meta: {
              title: 'menu.managing.school-info',
              keepAlive: true,
              noSidebar: true,
              icon: 'home',
              permission: ['teacher'],
              mode: USER_MODE.SCHOOL
            }
          },
          {
            path: '/manage/persona-info',
            name: 'PersonaInfo',
            component: () => import('@/views/account/manage/PersonaInfo'),
            meta: {
              title: 'Persona Info',
              keepAlive: true,
              noSidebar: true,
              permission: ['teacher']
              // mode: USER_MODE.SELF // 学校直接自动切换为个人
            }
          },
          {
            path: '/manage/academic',
            name: 'AcademicListV2',
            component: () => import('@/views/account/manage/AcademicListV2'),
            meta: { title: 'menu.managing.academic', noSidebar: true, keepAlive: true, permission: ['teacher'], mode: USER_MODE.SCHOOL }
          },
          {
            path: '/manage/curriculum',
            name: 'CirculumListV2',
            component: () => import('@/views/account/manage/CuriculumListV2'),
            meta: { title: 'menu.managing.curriculum', noSidebar: true, keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/manage/planning-format',
            name: 'PlanningFormat',
            component: () => import('@/views/teacher/manage/PlanningFormat/PlanningFormat'),
            meta: {
              title: 'menu.managing.planning-format',
              keepAlive: true,
              noSidebar: true,
              permission: ['teacher']
            }
          },
          {
            path: '/manage/class',
            name: 'MyCalssList',
            component: RouteView,
            redirect: '/manage/class/list',
            meta: { title: 'menu.my-class', noSidebar: true, keepAlive: true, permission: ['teacher'] },
            children: [
              {
                path: '/manage/class/list',
                name: 'MyCalssV2',
                component: () => import('@/views/account/manage/MyClassV2'),
                meta: { title: 'menu.my-class', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/manage/class/subject/:id?',
                name: 'SubjectClass',
                props: true,
                component: () => import('@/views/account/manage/ClassSubjectEdit'),
                meta: { title: 'Subject Class', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              }
            ]
          },
          {
            path: '/manage/student',
            name: 'SchoolStudent',
            component: RouteView,
            redirect: '/manage/student/list',
            meta: { title: 'Student Manage', keepAlive: true, permission: ['teacher'] },
            children: [
              {
                path: '/manage/student/list',
                name: 'SchoolStudentList',
                component: () => import('@/views/account/manage/SchoolStudent'),
                meta: { title: 'Student Manage', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/manage/student/detail/:id?',
                name: 'SchoolStudentEdit',
                props: true,
                component: () => import('@/views/account/manage/SchoolStudentEdit'),
                meta: { title: 'Student Manage', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/manage/student/upload/:classId?',
                name: 'SchoolStudentUpload',
                props: true,
                component: () => import('@/views/account/manage/SchoolStudentUpload'),
                meta: { title: 'Student Upload', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/manage/student/subject/:classId',
                name: 'ClassSubjectStudentManage',
                props: true,
                component: () => import('@/views/account/manage/ClassSubjectStudentManage'),
                meta: { title: 'Student Add', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              }
            ]
          },
          {
            path: '/manage/teacher',
            name: 'SchoolTeacher',
            component: RouteView,
            redirect: '/manage/teacher/list',
            meta: { title: 'Teacher Manage', keepAlive: true, permission: ['teacher'], mode: USER_MODE.SCHOOL },
            children: [
              {
                path: '/manage/teacher/list',
                name: 'SchoolTeacherList',
                component: () => import('@/views/account/manage/SchoolTeacher'),
                meta: { title: 'Teacher Manage', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/manage/teacher/detail/:id?',
                name: 'SchoolTeacherEdit',
                props: true,
                component: () => import('@/views/account/manage/SchoolTeacherEdit'),
                meta: { title: 'Teacher Manage', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              },
              {
                path: '/manage/teacher/upload',
                name: 'SchoolTeacherUpload',
                component: () => import('@/views/account/manage/SchoolTeacherUpload'),
                meta: { title: 'Teacher Upload', noSidebar: true, keepAlive: true, permission: ['teacher'] }
              }
            ]
          },
          {
            path: '/manage/role',
            name: 'SchoolRole',
            component: () => import('@/views/account/manage/SchoolRole'),
            meta: { title: 'Role Manage', noSidebar: true, keepAlive: true, permission: ['teacher'], mode: USER_MODE.SCHOOL }
          },
          {
            path: '/manage/persona/security',
            name: 'PersonalSecurity',
            component: () => import('@/views/account/manage/PersonaSecurity'),
            meta: { title: 'Login & Security', noSidebar: true, keepAlive: true, mode: USER_MODE.SELF }
          },
          {
            path: '/manage/persona/space',
            name: 'PersonalSpace',
            component: () => import('@/views/account/manage/PersonaSpace'),
            meta: { title: 'Persona Space', noSidebar: true, keepAlive: true, mode: USER_MODE.SELF }
          },
          {
            path: '/manage/school/space',
            name: 'SchoolSpace',
            component: () => import('@/views/account/manage/SchoolSpace'),
            meta: { title: 'School Space', noSidebar: true, keepAlive: true, mode: USER_MODE.SCHOOL }
          },
          {
            path: '/manage/verification',
            name: 'Verification',
            component: () => import('@/views/account/manage/Verification'),
            meta: { title: 'Application for certification/service', noSidebar: true, keepAlive: true, permission: ['teacher'], mode: USER_MODE.SELF }
          },
          {
            path: '/manage/tags',
            name: 'TagsSettingV2',
            component: () => import('@/views/account/manage/TagsSetting'),
            meta: { title: 'Tags Setting', noSidebar: true, keepAlive: true, permission: ['teacher'] }
          },
          {
            path: '/manage/order',
            name: 'Order',
            redirect: '/manage/order/buy',
            component: () => import('@/views/account/manage/order/OrderMain'),
            meta: { title: 'Order', noSidebar: true, keepAlive: true, permission: ['teacher'], fullLayout: true },
            children: [
              {
                path: '/manage/order/buy',
                name: 'TeacherBuyMain',
                redirect: '/manage/order/buy/purchases',
                component: RouteView,
                meta: { title: 'menu.buy', noSidebar: true, keepAlive: true, permission: ['teacher'], fullLayout: true },
                children: [
                  {
                    path: '/manage/order/buy/purchases',
                    name: 'TeacherBuyPurchases',
                    component: () => import('@/views/teacher/buy/Purchases'),
                    meta: { title: 'menu.buy.purchase', noSidebar: true, keepAlive: true, icon: 'money-collect', permission: ['teacher'] }
                  }
                ]
              },
              {
                path: '/manage/order/sell',
                name: 'TeacherSellMain',
                redirect: '/manage/order/sell/dashboard',
                component: RouteView,
                meta: { title: 'menu.sell', noSidebar: true, keepAlive: true, permission: ['teacher'], fullLayout: true },
                children: [
                  {
                    path: '/manage/order/sell/dashboard',
                    name: 'TeacherSellDashboard',
                    component: () => import('@/views/teacher/sell/Dashboard'),
                    meta: { title: 'menu.sell.dashboard', noSidebar: true, keepAlive: true, icon: 'money-collect', permission: ['teacher'] }
                  },
                  {
                    path: '/manage/order/sell/inspiration-teacher',
                    name: 'TeacherSellInspirationTeacher',
                    component: () => import('@/views/teacher/sell/InspirationTeacher'),
                    meta: { title: 'menu.sell.inspiration-teacher', noSidebar: true, keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
                  },
                  {
                    path: '/manage/order/sell/inspiration-student',
                    name: 'TeacherSellInspirationStudent',
                    component: () => import('@/views/teacher/sell/InspirationStudent'),
                    meta: { title: 'menu.sell.inspiration-student', noSidebar: true, keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
                  },
                  {
                    path: '/manage/order/sell/statistics',
                    name: 'TeacherSellStatistics',
                    component: () => import('@/views/teacher/sell/Statistics'),
                    meta: { title: 'menu.sell.statistics', noSidebar: true, keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
                  }
                  // {
                  //   path: '/manage/order/sell/followers',
                  //   name: 'TeacherSellFollowers',
                  //   component: () => import('@/views/teacher/sell/Followers'),
                  //   meta: { title: 'menu.sell.followers', keepAlive: true, icon: 'pay-circle', permission: ['teacher'] }
                  // }
                ]
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
           component: IframeLayout,
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
         // 课堂 iframe 引用组件
         {
           path: '/classroom-iframe',
           name: 'classroom-iframe',
           component: IframeLayout,
           children: [
             {
               path: '/classroom-iframe/class-evaluation/:taskId/:classId/:sessionId/:mode?',
               name: 'ClassroomClassEvaluation',
               props: true,
               component: () =>
                 import(/* webpackChunkName: "ClassSessionEvaluation" */ '@/views/classroom/ClassSessionEvaluation'),
               meta: { title: 'Classroom Evaluation', keepAlive: true }
             },
             {
               path: '/classroom-iframe/tip/',
               name: 'classroomTip',
               props: true,
               component: () => import(/* webpackChunkName: "Tip" */ '@/views/classroom/Tip'),
               meta: { title: 'TipPage', keepAlive: true }
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
          path: '/h5',
          name: 'H5',
          component: H5Layout,
          meta: { title: 'H5', keepAlive: true },
          children: [
            {
              path: '/h5/live/:code',
              name: 'H5Live',
              props: true,
              component: () => import('@/views/h5/Live'),
              meta: { title: 'Live', keepAlive: true }
            }
          ]
        },

        {
          path: '/tg',
          name: 'Promote',
          component: H5Layout,
          meta: { title: 'Promote', keepAlive: true },
          children: [
            {
              path: '/tg/:code',
              name: 'PromoteTg',
              props: true,
              component: () => import('@/views/promote/index'),
              meta: { title: 'Promote', keepAlive: true }
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
