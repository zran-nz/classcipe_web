<template>
  <div class="teacher-nav top-nav-v2">
    <div class='toggle-switcher'>
      <a-icon type="left" v-show='!collapsed' @click.native='hiddenMenu' />
      <a-icon type="right" v-show='collapsed' @click.native='expandMenuThrottle' />
    </div>
    <div class='top-menu'>
      <div class='menu menu-block' @dblclick.stop=''>
        <SidebarMenuItem label='Library' path='/v2/library'>
          <template v-slot:icon>
            <library-icon />
          </template>
        </SidebarMenuItem>
        <SidebarMenuItem label='School resource' path='/teacher/resource' v-if='userMode === USER_MODE.SCHOOL'>
          <template v-slot:icon>
            <resource-icon />
          </template>
        </SidebarMenuItem>
        <SidebarMenuItem label='Published' path='/teacher/main/my-published'>
          <template v-slot:icon>
            <published-icon />
          </template>
        </SidebarMenuItem>
        <SidebarMenuItem label='My content' path='/teacher/main/created-by-me'>
          <template v-slot:icon>
            <my-content-icon />
          </template>
        </SidebarMenuItem>
        <SidebarMenuItem label='My saved' path='/teacher/main/my-favorite'>
          <template v-slot:icon>
            <my-favorite-icon />
          </template>
        </SidebarMenuItem>
        <SidebarMenuItem label='Launch workshops' path='/teacher/main/live-workshops'>
          <template v-slot:icon>
            <live-workshops-icon />
          </template>
        </SidebarMenuItem>
        <SidebarMenuItem label='Live workshops' path='/teacher/main/my-register'>
          <template v-slot:icon>
            <live-workshops-icon />
          </template>
        </SidebarMenuItem>

        <sidebar-menu-list label='Classes' path-prefix='/teacher/class-session' :menu-list="classList" :active-id='activeClassId'>
          <template v-slot:icon>
            <class-icon />
          </template>
        </sidebar-menu-list>

        <SidebarMenuItem label='Co-teaching' path=''>
          <template v-slot:icon>
            <co-teaching-icon />
          </template>
        </SidebarMenuItem>
        <!-- <SidebarMenuItem label='Managing' path='/teacher/managing' v-if="userMode === USER_MODE.SELF || (currentSchool && currentSchool.roleNames && currentSchool.roleNames.includes(schoolUserRole.admin))">
          <template v-slot:icon>
            <managing-icon />
          </template>
        </SidebarMenuItem> -->
        <SidebarMenuItem label='Calendar' path='/teacher/main/calendar'>
          <template v-slot:icon>
            <icon-font type="icon-rili" class="detail-font"/>
          </template>
        </SidebarMenuItem>
      </div>
    </div>
    <AddPreference />
  </div>
</template>
<script>

import * as logger from '@/utils/logger'
import ResourceIcon from '@/assets/v2/icons/order.svg?inline'
import MyContentIcon from '@/assets/v2/icons/my_content.svg?inline'
import MyFavoriteIcon from '@/assets/v2/icons/my_favorites.svg?inline'
import LiveWorkshopsIcon from '@/assets/v2/icons/live_workshops.svg?inline'
import ClassIcon from '@/assets/v2/icons/class.svg?inline'
import CoTeachingIcon from '@/assets/v2/icons/Co-teaching.svg?inline'
import LibraryIcon from '@/assets/v2/icons/library.svg?inline'
import ManagingIcon from '@/assets/v2/icons/managing.svg?inline'
import PublishedIcon from '@/assets/v2/icons/publish.svg?inline'
import ScheduleIcon from '@/assets/v2/icons/schedule.svg?inline'
import { mapActions, mapMutations, mapState } from 'vuex'
import { HIDDEN_SIDEBAR, TOOGLE_USER_MODE } from '@/store/mutation-types'
import { SchoolUserRole } from '@/const/role'
import { USER_MODE } from '@/const/common'
import { SwitchUserModeSchool } from '@/api/user'
import SidebarMenuItem from '@/components/GlobalHeader/Common/SidebarMenuItem'
import SidebarMenuList from '@/components/GlobalHeader/Common/SidebarMenuList'
import AddPreference from '@/components/Teacher/AddPreference'
import { throttle } from 'lodash-es'
// import { listClass } from '@/api/v2/schoolClass'

export default {
  name: 'TeacherNav',
  components: {
    SidebarMenuList,
    SidebarMenuItem,
    MyContentIcon,
    MyFavoriteIcon,
    LiveWorkshopsIcon,
    ResourceIcon,
    ClassIcon,
    LibraryIcon,
    CoTeachingIcon,
    ManagingIcon,
    PublishedIcon,
    ScheduleIcon,
    AddPreference
  },
  data () {
    return {
      defaultSelectedKeys: [],
      selectedKeys: [],
      showTaskMode: false,
      schoolUserRole: SchoolUserRole,
      USER_MODE: USER_MODE,
      mainRouter: ['TeacherBuyMain', 'TeacherSellMain'],
      expandMenuThrottle: null,
      currentClassList: []
      // classList: []
    }
  },
  watch: {
    '$route.path' (to) {
      console.debug('nav watch route path change ' + to)
      // this.selectedKeys = [to]
    }
    // 'currentSchool.id' (newVal) {
    //   this.listClass()
    // }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode,
      classList: state => state.user.classList,

      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      currentRole: state => state.user.currentRole,
      collapsed: state => state.app.sideCollapsed
    }),
    navMenu() {
      const addRouters = this.mainMenu
      if (addRouters && addRouters.length > 0) {
        // 寻找路由 index => teacher => OrderMain
        const mainRouter = addRouters.find(item => item.name === 'index')
        if (mainRouter && mainRouter.children && mainRouter.children.length > 0) {
          const currentRouter = mainRouter.children.find(item => item.name === this.currentRole)
          if (currentRouter && currentRouter.children && currentRouter.children.length > 0) {
            const Mains = currentRouter.children.filter(item => this.mainRouter.includes(item.name))
            return Mains
          }
        }
      }
      return []
    },
    activeClassId() {
      if (this.$route.name === 'ClassSession') {
        return this.$route.params?.classId
      } else {
        return ''
      }
    }
  },
  mounted () {
    this.defaultSelectedKeys.push(this.$route.path)
  },
  created() {
    this.init()
    this.expandMenuThrottle = throttle(this.expandMenu, 200, {
      leading: true
    })
  },
  methods: {
    ...mapMutations([TOOGLE_USER_MODE, 'SET_CURRENT_SCHOOL']),
    ...mapActions(['GetClassList']),
    init() {
      const current = this.currentSchool?.id ? this.currentSchool : (this.info.schoolList && this.info.schoolList.length > 0) ? { ...this.info.schoolList[0] } : {}
      this.SET_CURRENT_SCHOOL(current)
      this.GetClassList(current.id)
      // this.listClass()
    },
    // listClass () {
    //   listClass({
    //     queryType: 0,
    //     schoolId: this.currentSchool.id,
    //     pageNo: 1,
    //     pageSize: 10000
    //   }).then(res => {
    //     console.info('teacher nav listClass res records', res.result?.records)
    //     this.classList = res.result?.records
    //   })
    // },
    handleChangePersonal() {
      // 后端记录当前用户是否是个人模式，在个人模式下后台设置school未空字符
      SwitchUserModeSchool({
        isPersonal: true,
        schoolId: '0'
      }).finally(() => {
        // this.justifyCurrentRoute()
        this.SET_CURRENT_SCHOOL()
        this[TOOGLE_USER_MODE](USER_MODE.SELF)
      })
    },
    handleChangeSchool(val) {
      SwitchUserModeSchool({
          isPersonal: false,
          schoolId: val.id
      }).then(res => {
        // 获取对应学校班级
        this[TOOGLE_USER_MODE](USER_MODE.SCHOOL)
        const item = this.info.schoolList.find(item => item.id === val.id)
        this.SET_CURRENT_SCHOOL(item)
        this.GetClassList(item.id)
        // this.justifyCurrentRoute()
      })
    },
    justifyCurrentRoute() {
      // 当前mode是school，且没有admin权限，则跳出去
      if (this.userMode === USER_MODE.SCHOOL &&
        !(this.currentSchool && this.currentSchool.roleNames &&
        this.currentSchool?.roleNames.includes(this.schoolUserRole.admin))) {
          this.$router.push({ path: '/teacher/main/created-by-me' })
      }
      // 没经过usermodemixin schoolmixin处理的直接刷新当前页
      const hasMixin = ['/teacher/managing', '/account/settings']
      let needReload = true
      hasMixin.forEach(route => {
        if (this.$route.path.indexOf(route) > -1) {
          needReload = false
        }
      })
      if (needReload) {
        // window.location.reload()
      }
    },
    triggerSearch () {
      console.info('teacher triggerSearch ' + this.searchText)
      this.$emit('triggerSearch', 'teacher', this.searchText)
      this.$router.push({ path: '/teacher/main/created-by-me', query: { searchKey: this.searchText } })
    },
    goToUnitPlan () {
      this.$router.push({
        path: '/teacher/unit-plan-redirect/create'
      })
    },
    showTaskModeChoose () {
      this.showTaskMode = true
    },
    closeTaskModeChoose() {
      this.showTaskMode = false
    },
    handleSwitchRole (role) {
      console.info('handleSwitchRole ' + role)
      this.$emit('switch-role', role)
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },

    handleExpandMenu() {
      console.info('handleExpandMenu', this.collapsed)
      this.$store.commit(HIDDEN_SIDEBAR, !this.collapsed)
    },

    expandMenu() {
      console.info('expandMenu')
      this.$store.commit(HIDDEN_SIDEBAR, false)
    },
    hiddenMenu() {
      console.info('hiddenMenu')
      this.$store.commit(HIDDEN_SIDEBAR, true)
    },

    handleSwitchMenu (path) {
      if (path) {
        this.$router.push({
          path
        })
      }
    },

    resizeSidebar () {
      console.info('resizeSidebar', window.innerWidth)
      if (window.innerWidth <= 1000) {
        this.$store.commit(HIDDEN_SIDEBAR, true)
      } else {
        this.$store.commit(HIDDEN_SIDEBAR, false)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.menu-block {
  margin-bottom: 10px;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  user-select: none;
}

.menu-icon-block {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px 10px 10px;
  justify-content: center;
  .cc-menu-icon-item {
    user-select: none;
    padding: 0 15px;
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;
  }

  .switch-school-personal {

    .current-role {
      font-family: Arial;
      font-weight: 400;
      color: #F1F3F8;
      cursor: pointer;
      user-select: none;
    }
  }
}

.cc-menu-item {
  color: @text-color-secondary-dark;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 41px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.top-nav-v2 {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);

  .top-menu {
    flex-grow: 1;
    max-height: calc(100vh - 90px);
    overflow-y: auto;
  }
}

.toggle-switcher {
  opacity: 0;
  color: #fff;
  position: absolute;
  right: 3px;
  top: 34px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease-in-out;
}

.ant-layout-sider:hover {
  .toggle-switcher {
    opacity: 1;
  }
}

</style>
