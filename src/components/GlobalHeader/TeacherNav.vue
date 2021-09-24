<template>
  <div class="top-nav teacher-nav">
    <div class="nav-left">
      <div class="nav-items menu-list">
        <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys">
          <a-menu-item key="/teacher/library">
            <router-link to="/teacher/library">
              <div class="nav-item">
                <div class="nav-icon">
                  <library-icon-svg />
                </div>
                <div class="nav-label">
                  {{ $t('menu.library') }}
                </div>
              </div>
            </router-link>
          </a-menu-item>
          <a-menu-item key="/teacher/managing">
            <div class="nav-item">
              <div class="nav-icon">
                <manage-icon-svg />
              </div>
              <div class="nav-label">
                Managing
              </div>
            </div>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-items search-box">
        <a-input
          placeholder="Search"
          v-model="searchText"
          @search="triggerSearch"
          @pressEnter="triggerSearch"
          class="my-nav-search">
          <sousuo-icon-svg slot="prefix"/>
        </a-input>
      </div>
      <div class="add-new">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="goToUnitPlan">
                {{ $t('menu.unit-plans') }}
              </a>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/task-redirect">
                {{ $t('menu.tasks') }}
              </router-link>
            </a-menu-item>
            <!--            <a-menu-item>
              <router-link to="/teacher/lesson-redirect">
                {{ $t('menu.lessons') }}
              </router-link>
            </a-menu-item>-->
            <a-menu-item>
              <router-link to="/teacher/evaluation-redirect">
                {{ $t('menu.evaluations') }}
              </router-link>
            </a-menu-item>
          </a-menu>
          <a-button
            style="padding: 0 20px;display:flex; box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);align-items:center ;height: 32px;border-radius: 6px;background: #FFFFFF;border: 1px solid #eee;font-family: Inter-Bold;color: #182552;"> Create Unit <a-icon type="caret-down" /> </a-button>
        </a-dropdown>
      </div>
      <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys">
        <a-menu-item key="/teacher/appraisal">
          <div class="nav-item">
            <div class="nav-icon">
              <edit-icon-svg />
            </div>
            <div class="nav-label">
              Appraisal
            </div>
          </div>
        </a-menu-item>
      </a-menu>
    </div>
  </div>
</template>
<script>

import * as logger from '@/utils/logger'
import LibraryIconSvg from '@/assets/icons/header/Librar_icony.svg?inline'
import EditIconSvg from '@/assets/icons/header/bianji.svg?inline'
import SousuoIconSvg from '@/assets/icons/header/sousuo.svg?inline'
import ManageIconSvg from '@/assets/icons/header/Managing_icon.svg?inline'

export default {
  name: 'TeacherNav',
  components: {
    LibraryIconSvg,
    EditIconSvg,
    ManageIconSvg,
    SousuoIconSvg
  },
  data () {
    return {
      searchText: null,
      defaultSelectedKeys: [],
      selectedKeys: []
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

a:hover {
  background: #EDF1F5;
}
</style>
