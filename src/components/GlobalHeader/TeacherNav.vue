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
          <a-menu-item key="/teacher/managing" v-if="$store.getters.userInfo.schoolRole === 'admin'">
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
          <a-menu-item key="/teacher/order" v-show="$store.getters.userInfo.username === 'luorixin1@gmail.com'">
            <router-link to="/teacher/order">
              <div class="nav-item">
                <div class="nav-icon">
                  <manage-icon-svg />
                </div>
                <div class="nav-label">{{ $t('menu.order') }}</div>
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
      showTaskMode: false
    }
  },
  watch: {
    '$route.path' (to) {
      logger.debug('nav watch route path change ' + to)
      this.selectedKeys = [to]
    }
  },
  mounted () {
    this.defaultSelectedKeys.push(this.$route.path)
  },
  methods: {
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
</style>
