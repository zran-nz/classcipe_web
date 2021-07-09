<template>
  <div class="top-nav teacher-nav">
    <div class="nav-left">
      <div class="nav-items menu-list">
        <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys">
          <a-menu-item key="/teacher/library">
            <router-link to="/teacher/library">
              <a-icon type="profile" /> {{ $t('menu.library') }}
            </router-link>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-items search-box">
        <a-input-search placeholder="input search text" style="width: 200px" v-model="searchText" @search="triggerSearch" @pressEnter="triggerSearch"/>
      </div>
      <div class="add-new">
        <a-dropdown>
          <a-button type="primary" icon="plus" >
            Add new
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <router-link to="/teacher/topics-from-experts">
                {{ $t('menu.topics-from-experts') }}
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <a @click="goToUnitPlan">
                {{ $t('menu.unit-plans') }}
              </a>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/unit-plan-material-redirect/none/create">
                {{ $t('menu.materials') }}
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/task-redirect">
                {{ $t('menu.tasks') }}
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/lesson-redirect">
                {{ $t('menu.lessons') }}
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/add-assessment">
                {{ $t('menu.assessments') }}
              </router-link>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script>

import * as logger from '@/utils/logger'

export default {
  name: 'TeacherNav',
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
    },
    goToUnitPlan () {
      this.$router.push({
        path: '/teacher/unit-plan-redirect/create'
      })
    }
  }
}
</script>
