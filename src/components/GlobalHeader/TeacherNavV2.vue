<template>
  <div class="teacher-nav top-nav-v2">
    <div class='top-menu'>
      <div class='menu menu-block'>
        <sidebar-menu-item label='Library' path='/teacher/library-v2'>
          <template v-slot:icon>
            <my-content-icon />
          </template>
        </sidebar-menu-item>
        <sidebar-menu-item label='Published' path='/teacher/main/my-published' v-if='userMode !== USER_MODE.SCHOOL'>
          <template v-slot:icon>
            <my-content-icon />
          </template>
        </sidebar-menu-item>
        <sidebar-menu-item label='My content' path='/teacher/main/created-by-me'>
          <template v-slot:icon>
            <my-content-icon />
          </template>
        </sidebar-menu-item>
        <sidebar-menu-item label='My favorites' path='/teacher/main/my-favorite'>
          <template v-slot:icon>
            <my-favorite-icon />
          </template>
        </sidebar-menu-item>
        <sidebar-menu-item label='Live workshops' path='/teacher/main/live-workshops'>
          <template v-slot:icon>
            <live-workshops-icon />
          </template>
        </sidebar-menu-item>

        <sidebar-menu-list label='Classes' path-prefix='' :menu-list="['TestClass1', 'TestClass2']">
          <template v-slot:icon>
            <class-icon />
          </template>
        </sidebar-menu-list>

        <sidebar-menu-item label='Co-teaching' path=''>
          <template v-slot:icon>
            <live-workshops-icon />
          </template>
        </sidebar-menu-item>
        <sidebar-menu-item label='Managing' path='/teacher/managing' v-if="userMode === USER_MODE.SELF || (currentSchool && currentSchool.roleNames && currentSchool.roleNames.includes(schoolUserRole.admin))">
          <template v-slot:icon>
            <live-workshops-icon />
          </template>
        </sidebar-menu-item>
      </div>
    </div>

    <div class='bottom-menu'>
      <div class='menu-icon-block'>
        <div class='cc-menu-icon-item avatar-menu-item'>
          <a-dropdown :placement="'topCenter'">
            <a-avatar :src="$store.getters.userInfo.avatar" v-if="$store.getters.userInfo.avatar"/>
            <a-avatar src="~@/assets/logo/beatop.png" v-else/>
            <a-menu slot="overlay">
              <a-menu-item key="settings" @click="handleToSettings">
                <a-icon type="user" />
                {{ $t('menu.account.profile') }}
              </a-menu-item>
              <template v-if="navMenu && navMenu.length > 0">
                <a-menu-item-group :key="'g1'+index" v-for="(item, index) in navMenu">
                  <template slot="title"><span>{{ $t(item.meta.title) }}</span> </template>
                  <a-menu-item :key="'g1_child_'+childIndex" v-for="(child, childIndex) in item.children">
                    <router-link :to="child.path">
                      {{ $t(child.meta.title) }}
                    </router-link>
                  </a-menu-item>
                </a-menu-item-group>
              </template>
              <a-menu-item key="logout" @click="handleLogout">
                <a-icon type="logout" />
                {{ $t('menu.account.logout') }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <div class='switch-school-personal'>
          <div class='role-school-personal'>
            <a-dropdown class='cc-role-dropdown' :placement="'topCenter'" :trigger="['click']">
              <a-menu slot="overlay">
                <a-menu-item class="self-mode" @click.native="handleChangePersonal">
                  <span class='menu-label'>Personal</span>
                </a-menu-item>
                <a-menu-item :key="item.id" v-for="item in info.schoolList" @click.native="handleChangeSchool(item)">
                  <span class='menu-label'>{{ item.schoolName }}</span>
                </a-menu-item>
              </a-menu>
              <div class='current-role'>
                {{ userMode === USER_MODE.SCHOOL ? currentSchool.schoolName : 'Personal' }} <a-icon type="caret-down" />
              </div>
            </a-dropdown>
          </div>
        </div>
        <div class='cc-menu-icon-item'>
          <router-link to='/notification'>
            <a-icon type="mail" theme='filled' :style="{ fontSize: '14px' }" v-if="$route.path.startsWith('/notification')"/>
            <a-icon type="mail" :style="{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)' }" v-else/>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import * as logger from '@/utils/logger'
import MyContentIcon from '@/assets/v2/icons/my_content.svg?inline'
import MyFavoriteIcon from '@/assets/v2/icons/my_favorites.svg?inline'
import LiveWorkshopsIcon from '@/assets/v2/icons/live_workshops.svg?inline'
import ClassIcon from '@/assets/v2/icons/class.svg?inline'
import { mapActions, mapMutations, mapState } from 'vuex'
import { HIDDEN_SIDEBAR, TOOGLE_USER_MODE } from '@/store/mutation-types'
import { SchoolUserRole } from '@/const/role'
import { USER_MODE } from '@/const/common'
import { SwitchUserModeSchool } from '@/api/user'
import AvatarDropdown from './AvatarDropdown'
import { Modal } from 'ant-design-vue'
import SidebarMenuItem from '@/components/GlobalHeader/Common/SidebarMenuItem'
import SidebarMenuList from '@/components/GlobalHeader/Common/SidebarMenuList'

export default {
  name: 'TeacherNav',
  components: {
    SidebarMenuList,
    SidebarMenuItem,
    MyContentIcon,
    MyFavoriteIcon,
    LiveWorkshopsIcon,
    ClassIcon,
    AvatarDropdown
  },
  data () {
    return {
      defaultSelectedKeys: [],
      selectedKeys: [],
      showTaskMode: false,
      schoolUserRole: SchoolUserRole,
      USER_MODE: USER_MODE,
      mainRouter: ['TeacherBuyMain', 'TeacherSellMain']
    }
  },
  watch: {
    '$route.path' (to) {
      logger.debug('nav watch route path change ' + to)
      this.selectedKeys = [to]
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode,

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
    }
  },
  mounted () {
    this.defaultSelectedKeys.push(this.$route.path)
  },
  created() {
    this.init()
  },
  methods: {
    ...mapMutations([TOOGLE_USER_MODE, 'SET_CURRENT_SCHOOL']),
    ...mapActions(['GetClassList']),
    init() {
      const current = this.currentSchool.id ? this.currentSchool : (this.info.schoolList && this.info.schoolList.length > 0) ? { ...this.info.schoolList[0] } : {}
      this.SET_CURRENT_SCHOOL(current)
      this.GetClassList(this.userMode)
    },
    handleChangePersonal() {
      this[TOOGLE_USER_MODE](USER_MODE.SELF)
      // 后端记录当前用户是否是个人模式，在个人模式下后台设置school未空字符
      SwitchUserModeSchool({
        isPersonal: true,
        schoolId: ''
      }).finally(() => {
        this.justifyCurrentRoute()
      })
    },
    handleChangeSchool(val) {
      this[TOOGLE_USER_MODE](USER_MODE.SCHOOL)
      const item = this.info.schoolList.find(item => item.id === val.id)
      this.SET_CURRENT_SCHOOL(item)
      SwitchUserModeSchool({
          isPersonal: false,
          schoolId: val.id
      }).then(res => {
        // 获取对应学校班级
        this.GetClassList(this.userMode)
        this.justifyCurrentRoute()
      })
    },
    justifyCurrentRoute() {
      // 当前mode是school，且没有admin权限，则跳出去
      if (this.userMode === USER_MODE.SCHOOL &&
        !(this.currentSchool && this.currentSchool.roleNames &&
        this.currentSchool.roleNames.includes(this.schoolUserRole.admin))) {
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
        window.location.reload()
      }
    },
    triggerSearch () {
      logger.info('teacher triggerSearch ' + this.searchText)
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
      logger.info('handleSwitchRole ' + role)
      this.$emit('switch-role', role)
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    },

    handleExpandMenu() {
      this.$store.commit(HIDDEN_SIDEBAR, false)
    },

    handleSwitchMenu (path) {
      if (path) {
        this.$router.push({
          path
        })
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
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px 8px 10px;
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
    flex-grow: 1;

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
  }

  .bottom-menu {
    flex-shrink: 0;
  }
}

</style>
