<template>
  <div class="top-nav teacher-nav">
    <div class="nav-left">
      <div class="nav-items menu-list">
        <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys">
          <a-menu-item key="/teacher/library-v2">
            <router-link to="/teacher/library-v2">
              <div class="nav-item">
                <div class="nav-icon">
                  <library-icon-svg />
                </div>
                <div class="nav-label">
                  {{ $t('menu.library') }}
                </div>
                <div class="nav-button-border"></div>
              </div>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/teacher/managing" v-if="userMode === USER_MODE.SELF || (currentSchool && currentSchool.roleNames && currentSchool.roleNames.includes(schoolUserRole.admin))">
            <router-link to="/teacher/managing">
              <div class="nav-item">
                <div class="nav-icon">
                  <manage-icon-svg />
                </div>
                <div class="nav-label">Managing</div>
                <div class="nav-button-border"></div>
              </div>
            </router-link>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="nav-right">
      <!--      <div class="nav-items search-box">-->
      <!--        <a-input-->
      <!--          placeholder="Search"-->
      <!--          v-model="searchText"-->
      <!--          @search="triggerSearch"-->
      <!--          @pressEnter="triggerSearch"-->
      <!--          class="my-nav-search">-->
      <!--          <sousuo-icon-svg slot="prefix"/>-->
      <!--        </a-input>-->
      <!--      </div>-->
      <div class="add-new">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="goToUnitPlan">
                {{ $t('menu.unit-plan') }}
              </a>
            </a-menu-item>
            <a-menu-item>
              <a @click='showTaskModeChoose'> {{ $t('menu.task') }}</a>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/evaluation-redirect">
                {{ $t('menu.evaluation') }}
              </router-link>
            </a-menu-item>
          </a-menu>
          <a-button
            style="padding: 0 20px;display:flex; box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);align-items:center ;height: 32px;border-radius: 6px;background: #FFFFFF;border: 1px solid #eee;font-family: Inter-Bold;color: #182552;"> Create New <a-icon type="caret-down" /> </a-button>
        </a-dropdown>
      </div>
      <div class="user-mode">
        <label class="self-mode" :class="{active: userMode === USER_MODE.SELF}" @click="handleChange(USER_MODE.SELF)">Personal</label>
        <a-dropdown :class="{active: userMode === USER_MODE.SCHOOL, 'school-mode': true}" v-show="info.schoolList && info.schoolList.length > 0">
          <a class="ant-dropdown-link" @click="handleChange(USER_MODE.SCHOOL)">
            {{ currentSchool.schoolName }} <a-icon type="down" />
          </a>
          <a-menu slot="overlay" @click="handleChangeSchool">
            <a-menu-item :key="item.id" v-for="item in info.schoolList">
              <a href="javascript:;">{{ item.schoolName }}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>

    <task-mode-choose @close='closeTaskModeChoose' :visible='showTaskMode' v-if='showTaskMode'/>
  </div>
</template>
<script>

import * as logger from '@/utils/logger'
import LibraryIconSvg from '@/assets/icons/header/Librar_icony.svg?inline'
import EditIconSvg from '@/assets/icons/header/bianji.svg?inline'
import SousuoIconSvg from '@/assets/icons/header/sousuo.svg?inline'
import ManageIconSvg from '@/assets/icons/header/Managing_icon.svg?inline'
import TaskModeChoose from '@/components/QuickSession/TaskModeChoose'
import { mapState, mapMutations, mapActions } from 'vuex'
import { TOOGLE_USER_MODE } from '@/store/mutation-types'
import { SchoolUserRole } from '@/const/role'
import { USER_MODE } from '@/const/common'
import { SwitchSchool } from '@/api/user'

export default {
  name: 'TeacherNav',
  components: {
    TaskModeChoose,
    LibraryIconSvg,
    EditIconSvg,
    ManageIconSvg,
    SousuoIconSvg
  },
  data () {
    return {
      searchText: null,
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
      this.justifyCurrentRoute()
    },
    handleChangeSchool(val) {
      this[TOOGLE_USER_MODE](USER_MODE.SCHOOL)
      const item = this.info.schoolList.find(item => item.id === val.key)
      this.SET_CURRENT_SCHOOL(item)
      SwitchSchool({
          schoolId: val.key
      }).then(res => {
        // 获取对应学校班级
        this.GetClassList(this.userMode)
      })
      this.justifyCurrentRoute()
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
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.my-nav-search {
  width: 150px;
}

.add-new {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.top-nav {
  ul, ol {
    margin-bottom: 0;
  }
}

a {
  color: #15C39A;
}

ant-dropdown {
  a:hover {
    background: #EDF1F5;
  }
}

.nav-button-border {
  display: none;
}

.nav-item {
  position: relative;
  .nav-icon {
    z-index: 50;
  }
  .nav-label {
    z-index: 50;
  }
}

.router-link-active {
  .nav-button-border {
    position: absolute;
    bottom: 0;
    width: 80%;
    height: 4px;
    border: 1px solid #15c39a;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: #15c39a;
    display: inline-block;
    z-index: 100;
  }
}

.user-mode {
  display: flex;
  align-items: center;
  .self-mode {
    margin-right: 20px;
    color: #fff;
    cursor: pointer;
    &.active {
      color: #f59a23;
    }
  }
  .school-mode {
    color: #fff;
    &.active {
      color: #f59a23;
      /deep/ .anticon {
        color: #f59a23;
      }
    }
  }
  /deep/ .ant-btn {
    background: transparent;
    color: #fff;
  }
  /deep/ .anticon {
    color: #fff;
  }
}
</style>
