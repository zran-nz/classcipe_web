<template>
  <div class="top-nav teacher-nav">
    <div class="nav-left">
      <div class="nav-items menu-list">
        <a-menu mode="horizontal" theme="dark">
          <a-menu-item>
            <router-link to="/teacher/main">
              <a-icon type="home" /> {{ $t('menu.main') }}
            </router-link>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/teacher/library">
              <a-icon type="profile" /> {{ $t('menu.library') }}
            </router-link>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/teacher/my-content">
              <a-icon type="pushpin" /> {{ $t('menu.my-content') }}
            </router-link>
          </a-menu-item>
          <a-menu-item>
            <router-link to="/teacher/my-class">
              <a-icon type="contacts" /> {{ $t('menu.my-class') }}
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
              <router-link to="/teacher/add-unit-plan">
                Unit plan
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/add-instructional-content">
                Instructional content
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/add-task">
                Task
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/teacher/add-assessment">
                Assessment
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
      searchText: null
    }
  },
  methods: {
    triggerSearch () {
      logger.info('teacher triggerSearch ' + this.searchText)
      this.$emit('triggerSearch', 'teacher', this.searchText)
    }
  }
}
</script>
