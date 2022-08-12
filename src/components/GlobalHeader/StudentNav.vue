<template>
  <div class="top-nav teacher-nav">
    <div class="nav-left">
      <div class="nav-items menu-list">
        <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys">
          <a-menu-item key="/student/library-v2" v-show="userMode === USER_MODE.SELF">
            <router-link to="/student/library-v2">
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
        </a-menu>
      </div>
    </div>
    <div class="nav-right">
      <a-input-search
        placeholder="Enter code"
        class="study-code"
        enter-button="Go"
        v-model="code"
        @search="enterCode"
      />
      <div class="user-mode">
        <label class="self-mode" :class="{active: userMode === USER_MODE.SELF}" @click="handleChange(USER_MODE.SELF)">Self-study</label>
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
        <!-- <a-select :value="school" class="school-mode" :class="{active: userMode === USER_MODE.SCHOOL}" @focus="handleChange(USER_MODE.SCHOOL)" @change="handleChangeSchool">
          <a-select-option value="eastWest">
            East west study
          </a-select-option>
        </a-select> -->
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
import { TOOGLE_USER_MODE, ACCESS_TOKEN } from '@/store/mutation-types'
import { lessonHost } from '@/const/googleSlide'
import { USER_MODE } from '@/const/common'

import { mapState, mapMutations, mapActions } from 'vuex'
import storage from 'store'

export default {
  name: 'StudentNav',
  components: {
    LibraryIconSvg,
    EditIconSvg,
    ManageIconSvg,
    SousuoIconSvg
  },
  data () {
    return {
      defaultSelectedKeys: [],
      selectedKeys: [],
      code: '',
      USER_MODE: USER_MODE
    }
  },
  watch: {
    '$route.path' (to) {
      logger.debug('nav watch route path change ' + to)
      this.selectedKeys = [to]
      // 如果是学校模式，当前路由如果是library，则跳出到mytask
      if (this.userMode === USER_MODE.SCHOOL && to === '/student/library-v2') {
        this.$router.push({ path: '/student/main/my-task' })
      }
    }
  },
  mounted () {
    this.defaultSelectedKeys.push(this.$route.path)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool
    })
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
      this.GetClassList()
    },
    handleChange(val) {
      this[TOOGLE_USER_MODE](val)
      // 如果是学校模式，当前路由如果是library，则跳出到mytask
      if (val === USER_MODE.SCHOOL && this.$route.name === 'StudentLibraryV2') {
        this.$router.push({ path: '/student/main/my-task' })
      }
    },
    handleChangeSchool(val) {
      this[TOOGLE_USER_MODE](USER_MODE.SCHOOL)
      const item = this.info.schoolList.find(item => item.id === val.key)
      this.SET_CURRENT_SCHOOL(item)
    },
    enterCode() {
      if (!this.code) return
      const targetUrl = lessonHost + 's/' + this.code + '?token=' + storage.get(ACCESS_TOKEN)
      window.location.href = targetUrl
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.nav-right {
  align-items: center;
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
.study-code {
  width: 200px;
  margin-right: 10px;
}
</style>
