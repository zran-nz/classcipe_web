<template>
  <div class="teacher-nav top-nav-v2" :class="{'collapse-menu': collapseMenu}">
    <div class='role menu-block'>
      <a-dropdown class='cc-role-dropdown'>
        <a-menu slot="overlay" @click="handleChangeSchool">
          <a-menu-item class="self-mode" :class="{active: userMode === USER_MODE.SELF}" @click="handleChange(USER_MODE.SELF)">
            <span class='menu-label'>Personal</span>
          </a-menu-item>

          <a-menu-item :key="item.id" v-for="item in info.schoolList">
            <span class='menu-label'>{{ item.schoolName }}</span>
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px" @click="handleChange(USER_MODE.SCHOOL)"> {{ currentSchool.schoolName }} <a-icon type="down" /> </a-button>
      </a-dropdown>
    </div>
    <div class='menu menu-block'>
      <div class='cc-menu-item'>
        <router-link to='/teacher/library-v2'>Library</router-link>
      </div>
      <div class='cc-menu-item'>
        <router-link to='/teacher/main/created-by-me'>Published</router-link>
      </div>
      <div class='cc-menu-item'>
        <router-link to='/teacher/main/created-by-me'>My Content</router-link>
      </div>
      <div class='cc-menu-item'>
        <router-link to='/teacher/main/my-favorite'>My Favorite</router-link>
      </div>
    </div>
    <div class='live-workshops menu-block'>
      <div class='cc-menu-item'>
        <router-link to=''>Live workshops</router-link>
      </div>
    </div>
    <div class='classroom menu-block'></div>
    <div class='manager menu-block' v-if="userMode === USER_MODE.SELF || (currentSchool && currentSchool.roleNames && currentSchool.roleNames.includes(schoolUserRole.admin))">
      <div class='cc-menu-item'>
        <router-link to='/teacher/managing'>Managing</router-link>
      </div>
    </div>
    <div class='personal menu-icon-block' :style="{ width: collapseMenu ? '80px' : '256px'}">
      <div class='cc-menu-icon-item'>
        <router-link to='/notification'>
          <a-icon type="mail" theme="filled" :style="{ fontSize: '22px' }" />
        </router-link>
      </div>
      <div class='cc-menu-icon-item'>
        <router-link to='/account/settings/basic'>
          <a-avatar size="small" :src="$store.getters.userInfo.avatar" v-if="$store.getters.userInfo.avatar"/>
          <a-avatar size="small" src="~@/assets/logo/beatop.png" v-else/>
        </router-link>
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
import { TOOGLE_USER_MODE } from '@/store/mutation-types'
import { SchoolUserRole } from '@/const/role'
import { USER_MODE } from '@/const/common'
import { SwitchUserModeSchool } from '@/api/user'
import AvatarDropdown from './AvatarDropdown'

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
      collapseMenu: false, // 菜单是否收缩显示
      defaultSelectedKeys: [],
      selectedKeys: [],
      showTaskMode: false,
      schoolUserRole: SchoolUserRole,
      USER_MODE: USER_MODE
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
      userMode: state => state.app.userMode
    })
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
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.role {
  padding-left: 16px;
}

.menu-block {
  margin: 15px 0;
  width: 100%;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.menu-icon-block {
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  .cc-menu-icon-item {
    width: 50px;
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

  a, a:visited, a:active, a:hover {
    padding: 10px 10px 10px 24px;
    display: block;
    width: 100%;
    color: @text-color-secondary-dark;
  }

  &:hover {
    color: @text-color-inverse;
    background: @primary-color;
  }
}

.active-menu-item {
  color: @text-color-inverse;
  background: @primary-color;
}

.collapse-menu {
  .cc-menu-item {
    padding: 10px;
  }
}

.top-nav-v2 {
  padding-bottom: 50px;
}

.personal {
  position: fixed;
  bottom: 0;
}
</style>
