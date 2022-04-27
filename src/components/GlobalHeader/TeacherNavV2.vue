<template>
  <div class="teacher-nav top-nav-v2">
    <div class='top-menu'>
      <div class='collapse menu-block'>
        <div class='cc-menu-item collapse' @click.stop='handleExpandMenu'>
          <a href='javascript:void(0)'>
            <a-icon type="menu-unfold" />
          </a>
        </div>
      </div>
      <div class='role menu-block' @click.stop.prevent=''>
        <a-dropdown class='cc-role-dropdown' :placement="'topCenter'" :trigger="['click']">
          <a-menu slot="overlay" @click.stop="handleChangeSchool">
            <a-menu-item class="self-mode" :class="{active: userMode === USER_MODE.SELF}" @click.native.stop.prevent="handleChange(USER_MODE.SELF)">
              <span class='menu-label'>Personal</span>
            </a-menu-item>
            <a-menu-item :key="item.id" v-for="item in info.schoolList">
              <span class='menu-label'>{{ item.schoolName }}</span>
            </a-menu-item>
          </a-menu>
          <a-button @click="handleChange(USER_MODE.SCHOOL)"> {{ currentSchool.schoolName }} <a-icon type="down" /> </a-button>
        </a-dropdown>
      </div>
      <div class='menu menu-block'>
        <div class='cc-menu-item' :class="{'active-menu': $route.path === '/teacher/library-v2'}">
          <router-link to='/teacher/library-v2'>
            <a-icon type="bank" />
            <span class='menu-label'>Library</span>
          </router-link>
        </div>
        <div class='cc-menu-item' :class="{'active-menu': $route.path === ''}">
          <router-link to='/teacher/main/created-by-me'>
            <a-icon type="container" />
            <span class='menu-label'>Published</span>
          </router-link>
        </div>
        <div class='cc-menu-item' :class="{'active-menu': $route.path === '/teacher/main/created-by-me'}">
          <router-link to='/teacher/main/created-by-me'>
            <a-icon type="shopping" />
            <span class='menu-label'>My Content</span>
          </router-link>
        </div>
        <div class='cc-menu-item' :class="{'active-menu': $route.path === '/teacher/main/my-favorite'}">
          <router-link to='/teacher/main/my-favorite'>
            <a-icon type="star" />
            <span class='menu-label'>My Favorite</span>
          </router-link>
        </div>
      </div>
      <div class='live-workshops menu-block'>
        <div class='cc-menu-item' :class="{'active-menu': $route.path === ''}">
          <router-link to=''>
            <a-icon type="desktop" />
            <span class='menu-label'>Live workshops</span>
          </router-link>
        </div>
      </div>
      <div class='classroom menu-block'></div>
      <div class='manager menu-block' v-if="userMode === USER_MODE.SELF || (currentSchool && currentSchool.roleNames && currentSchool.roleNames.includes(schoolUserRole.admin))">
        <div class='cc-menu-item' :class="{'active-menu': $route.path.startsWith('/teacher/managing')}">
          <router-link to='/teacher/managing'>
            <a-icon type="control" />
            <span class='menu-label'>
              <span class='menu-label'>Managing</span>
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class='bottom-menu'>
      <div class='personal menu-icon-block'>
        <div class='cc-menu-icon-item'>
          <router-link to='/notification'>
            <a-icon type="mail" theme='filled' :style="{ fontSize: '14px' }" v-if="$route.path.startsWith('/notification')"/>
            <a-icon type="mail" :style="{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.65)' }" v-else/>
          </router-link>
        </div>
        <div class='cc-menu-icon-item avatar-menu-item'>
          <a-dropdown :placement="'topCenter'">
            <a-avatar size='small' :src="$store.getters.userInfo.avatar" v-if="$store.getters.userInfo.avatar"/>
            <a-avatar size='small' src="~@/assets/logo/beatop.png" v-else/>
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
      </div>
    </div>
  </div>
</template>
<script>

import * as logger from '@/utils/logger'
import LibraryIconSvg from '@/assets/icons/header/Librar_icony.svg?inline'
import EditIconSvg from '@/assets/icons/header/bianji.svg?inline'
import SousuoIconSvg from '@/assets/icons/header/sousuo.svg?inline'
import ManageIconSvg from '@/assets/icons/header/Managing_icon.svg?inline'
import { mapActions, mapMutations, mapState } from 'vuex'
import { SIDEBAR_TYPE, TOOGLE_USER_MODE } from '@/store/mutation-types'
import { SchoolUserRole } from '@/const/role'
import { USER_MODE } from '@/const/common'
import { SwitchUserModeSchool } from '@/api/user'
import AvatarDropdown from './AvatarDropdown'
import { Modal } from 'ant-design-vue'

export default {
  name: 'TeacherNav',
  components: {
    LibraryIconSvg,
    EditIconSvg,
    ManageIconSvg,
    SousuoIconSvg,
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
    handleChange(val) {
      alert('handleChange' + val)
      this[TOOGLE_USER_MODE](val)
      // 后端记录当前用户是否是个人模式，在个人模式下后台设置school未空字符
      SwitchUserModeSchool({
        isPersonal: val === USER_MODE.SELF,
        schoolId: val === USER_MODE.SCHOOL ? this.currentSchool?.id : ''
      }).finally(() => {
        this.justifyCurrentRoute()
      })
    },
    handleChangeSchool(val) {
      alert('handleChangeSchool' + val)
      this[TOOGLE_USER_MODE](USER_MODE.SCHOOL)
      const item = this.info.schoolList.find(item => item.id === val.key)
      this.SET_CURRENT_SCHOOL(item)
      SwitchUserModeSchool({
          schoolId: val.key
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
      this.$store.commit(SIDEBAR_TYPE, false)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.role {
  padding-left: 24px;
  height: 41px;
}

.menu-block {
  margin: 15px 0;
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
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 10px;
  padding-left: 24px;
  .cc-menu-icon-item {
    user-select: none;
    width: 50px;
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
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

  a {
    padding: 10px 10px 10px 24px;
    display: block;
    width: 100%;
    color: @text-color-secondary-dark;
  }

  a:hover, a:visited, a:active {
    color: #fff;
  }

  &:hover {
    color: #fff;
  }
}

.active-menu {
  background: @primary-color;

  a {
    color: #fff;
  }
}

.collapse-menu {
  .cc-menu-item {
    padding: 10px;
  }
}

.top-nav-v2 {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);

  .top-menu {
    flex-grow: 1;
  }

  .bottom-menu {
    flex-shrink: 0;
  }
}

.menu-label {
  padding-left: 5px;
}

.collapse {
  display: none;
}

.ant-layout-sider-collapsed {
  .cc-menu-item {
    a {
      padding: 10px 10px 10px 30px;
    }
  }
  .menu-label {
    display: none;
  }
  .role {
    display: none;
  }
  .collapse {
    display: flex;
  }

  .menu-icon-block {
    display: flex;
    flex-direction: column;
    padding-left: 30px;
  }

  .avatar-menu-item {
    margin-left: -8px;
  }
}

.collapse-icon {
  position: absolute;
  top: 10px;
  right: 5px;
  z-index: 1000;
}
</style>
